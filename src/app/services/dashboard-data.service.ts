import { Injectable } from '@angular/core';
import { ItemId, VQT, TagDataProxy, TagValue, ValueAtTimeRequest, AbsoluteHistoryRequest, TagValues, InitialValue, RelativeHistoryRequest, TimeScale, SimulatorItem, SimulatorTag, DocumentDataProxy } from '../proxies/data-simulator-api';
import { Observable, Subject, Subscription } from 'rxjs';
import { ActiveDashboardService } from './active-dashboard/active-dashboard.service';
import { RequestType, TimePeriodType, RelativeTimeScale } from '../proxies/dashboard-api';
import { TimeService } from './time.service';
import { RefreshScale } from './active-dashboard/dashboard-display-settings';

export class TagData {
  constructor(public startTime: Date, public endTime: Date, public values: VQT[]) { }
}

export class ResponseTimeFrame {
  constructor(public targetTime: Date, public startTime: Date, public endTime: Date) { }
}

interface IChannel {
  connections: number;
  broadcast: Subject<TagData | string>
}

class TagChannel implements IChannel {
  constructor(public connections: number, public broadcast: Subject<TagData>) { }
}

class DocumentChannel implements IChannel {
  constructor(public connections: number, public broadcast: Subject<string>) { }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private intervalID?: number = null;
  private channels: Map<ItemId, IChannel> = new Map<ItemId, IChannel>();
  private lastRefreshTime: Date = null;
  private dataRequestSubscription: Subscription;
  private dataRefreshedSource = new Subject<ResponseTimeFrame>();

  dataRefreshed$ = this.dataRefreshedSource.asObservable();

  constructor(
    private tagDataProxy: TagDataProxy,
    private activeDashboardService: ActiveDashboardService,
    private timeService: TimeService,
    private documentDataProxy: DocumentDataProxy
  ) {
  }

  openChannel(item: SimulatorItem): Observable<TagData | string> {
    let channel = this.channels.get(item.id);
    if (channel != null) {
      channel.connections++;
    } else {
      if (item instanceof SimulatorTag) {
        channel = new TagChannel(1, new Subject<TagData>());
      } else {
        channel = new DocumentChannel(1, new Subject<string>());
      }
      this.channels.set(item.id, channel);
    }

    return channel.broadcast.asObservable();
  }

  closeChannel(item: SimulatorItem) {
    const channel = this.channels.get(item.id);
    if (channel != null) {
      channel.connections--;
      if (channel.connections === 0) {
        this.channels.delete(item.id);
      }
    }
  }

  refresh(maxValueCount: number = 0) {
    // refresh all items
    this.refreshItems(Array.from(this.channels.keys()), maxValueCount);
  }

  private refreshItems(items: ItemId[], maxValueCount: number) {
    // are we auto-refreshing?
    const wasRefreshing = this.isRefreshing;

    // refresh all dashboard items
    this.doRefresh(items, maxValueCount);

    if (wasRefreshing) {
      // and re-start refresh pump
      this.startRefreshPump(maxValueCount);
    }
  }

  refreshItem(item: ItemId, maxValueCount: number = 0) {
    // refresh requested item
    this.refreshItems([item], maxValueCount);
  }

  private doRefresh(items: ItemId[], maxValueCount: number) {
    // stop any ongoing auto-refresh
    this.stopRefresh();

    // refresh tags
    const tags = this.getDataItems(items, true);
    if (tags.length > 0) {
      this.refreshTags(tags, maxValueCount);
    }

    // refresh documents
    const documents = this.getDataItems(items, false);
    if (documents.length > 0) {
      this.refreshDocuments(documents);
    }
  }

  private refreshDocuments(documents: ItemId[]) {
    this.documentDataProxy.getDocumentValues(documents).subscribe(values => {
      for (let value of values) {
        const channel = this.channels.get(value.document);
        if (channel != null) {
          channel.broadcast.next(value.url);
        }
      }
    });
  }

  private getDataItems(items: ItemId[], tags: boolean): ItemId[] {
    return items.filter(i => {
      const channel = this.channels.get(i);
      return tags ? channel instanceof TagChannel : channel instanceof DocumentChannel;
    });
  }

  private refreshTags(tags: ItemId[], maxValueCount: number) {
    if (this.activeDashboardService.requestType === RequestType.Live) {
      this.dataRequestSubscription = this.tagDataProxy.getLiveValue(tags).subscribe(values => {
        this.broadcastSingleValue(values);
      });
    } else {
      const timeFrame = this.activeDashboardService.getRequestTimeFrame();
      if (this.activeDashboardService.requestType === RequestType.ValueAtTime) {
        const request = new ValueAtTimeRequest();
        request.targetTime = timeFrame.targetTime;
        request.tags = tags;
        this.dataRequestSubscription = this.tagDataProxy.getValueAtTime(request).subscribe(values => {
          this.broadcastSingleValue(values);
        });
      } else {
        if (timeFrame.timePeriod.type === TimePeriodType.Absolute) {
          const request = new AbsoluteHistoryRequest();
          request.tags = tags;
          request.startTime = timeFrame.timePeriod.startTime;
          request.endTime = timeFrame.timePeriod.endTime;
          request.initialValue = InitialValue.Linear;
          request.maxCount = maxValueCount;
          this.dataRequestSubscription = this.tagDataProxy.getHistoryAbsolute(request).subscribe(response => {
            this.broadcastMultipleValues(response.startTime, response.endTime, response.values);
          });
        } else {
          const request = new RelativeHistoryRequest();
          request.tags = tags;
          request.maxCount = maxValueCount;
          if (!this.isRefreshing || this.lastRefreshTime === null) {
            // not auto refreshing or not doing partial updates yet (first pass)
            request.offsetFromNow = timeFrame.timePeriod.offsetFromNow;
            request.timeScale = this.toTimeScale(timeFrame.timePeriod.timeScale);
            request.initialValue = InitialValue.Linear;
          } else {
            // subsequent (partial) auto-refresh pass, only ask for delta (from last end time to now)
            request.anchorTime = this.lastRefreshTime;
          }
          this.dataRequestSubscription = this.tagDataProxy.getHistoryRelative(request).subscribe(response => {
            // work backwards from resolved end time to get full time period
            const startTime = this.timeService.resolveRelativeTime(
              response.endTime, timeFrame.timePeriod.offsetFromNow, timeFrame.timePeriod.timeScale);
            this.broadcastMultipleValues(startTime, response.endTime, response.values);
            this.lastRefreshTime = response.endTime;
          });
        }
      }
    }
  }

  private toTimeScale(timeScale: RelativeTimeScale): TimeScale {
    switch (timeScale) {
      case RelativeTimeScale.Seconds:
        return TimeScale.Seconds;

      case RelativeTimeScale.Minutes:
        return TimeScale.Minutes;

      case RelativeTimeScale.Hours:
        return TimeScale.Hours;

      case RelativeTimeScale.Days:
        return TimeScale.Days;

      default:
        throw "Invalid time scale.";
    }
  }

  private broadcastMultipleValues(startTime: Date, endTime: Date, values: TagValues[]) {
    for (let value of values) {
      const channel = this.channels.get(value.tag);
      if (channel != null) {
        channel.broadcast.next({ startTime: startTime, endTime: endTime, values: value.values });
      }
    }

    this.dataRefreshedSource.next(new ResponseTimeFrame(null, startTime, endTime));
  }

  private broadcastSingleValue(values: TagValue[]) {
    for (let value of values) {
      const channel = this.channels.get(value.tag);
      if (channel != null) {
        channel.broadcast.next({ startTime: value.value.time, endTime: value.value.time, values: [value.value] });
      }
    }

    // single data requests always return a value and they all have the same timestamp
    this.dataRefreshedSource.next(new ResponseTimeFrame(values[0].value.time, null, null));
  }

  private get isRefreshing(): boolean {
    return this.intervalID !== null;
  }

  startRefresh(maxValueCount: number = 0) {
    // do a full refresh once
    this.doRefresh(Array.from(this.channels.keys()), maxValueCount);

    // and start refresh pump
    this.startRefreshPump(maxValueCount);
  }

  private startRefreshPump(maxValueCount: number) {
    this.intervalID = window.setInterval(() => {
      const tags = this.getDataItems(Array.from(this.channels.keys()), true);
      if (tags.length > 0) {
        // we only auto-refresh tags
        if (this.activeDashboardService.requestType === RequestType.Live) {
          // requesting live values, update tags
          this.refreshTags(tags, maxValueCount);
        } else if (this.activeDashboardService.requestType === RequestType.History) {
          const timeFrame = this.activeDashboardService.getRequestTimeFrame();
          if (timeFrame.timePeriod.type === TimePeriodType.Relative) {
            // requesting relative history, update tags
            this.refreshTags(tags, maxValueCount);
          }
        }
      }
    }, this.getInterval() * 1000);
  }

  private getInterval(): number {
    switch (this.activeDashboardService.refreshScale) {
      case RefreshScale.Seconds:
        return this.activeDashboardService.refreshRate;

      case RefreshScale.Minutes:
        return this.activeDashboardService.refreshRate * 60;

      case RefreshScale.Hours:
        return this.activeDashboardService.refreshScale * 60 * 60;

      default:
        throw "Invalid refresh scale.";
    }
  }

  stopRefresh() {
    if (this.isRefreshing) {
      // stop our data pump
      window.clearInterval(this.intervalID);

      // cancel last outgoing data request
      this.dataRequestSubscription.unsubscribe();

      // we are no longer auto refreshing
      this.intervalID = null;

      // start with full data pass on next refresh
      this.lastRefreshTime = null;
    }
  }
}
