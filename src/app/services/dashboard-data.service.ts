import { Injectable } from '@angular/core';
import { ItemId, VQT, TagDataProxy, TagValue, ValueAtTimeRequest, AbsoluteHistoryRequest, TagValues, InitialValue, RelativeHistoryRequest, TimeScale } from '../proxies/data-simulator-api';
import { Observable, Subject, Subscription } from 'rxjs';
import { ActiveDashboardService } from './active-dashboard.service';
import { RequestType, TimePeriodType, RelativeTimeScale, TimePeriod } from '../proxies/dashboard-api';
import { TimeService } from './time.service';

export class TagData {
  constructor(public startTime: Date, public endTime: Date, public values: VQT[]) { }
}

export class ResponseTimeFrame {
  constructor(public targetTime: Date, public startTime: Date, public endTime: Date) { }
}

class Channel {
  constructor(public connections: number, public data: Subject<TagData>) { }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private intervalID?: number = null;
  private channels: Map<ItemId, Channel> = new Map<ItemId, Channel>();
  private readonly interval: number = 2;
  private lastRefreshTime: Date = null;
  private dataRequestSubscription: Subscription;
  private dataRefreshedSource = new Subject<ResponseTimeFrame>();

  dataRefreshed$ = this.dataRefreshedSource.asObservable();

  constructor(
    private dataProxy: TagDataProxy,
    private activeDashboardService: ActiveDashboardService,
    private timeService: TimeService
  ) {
  }

  openChannel(tagId: ItemId): Observable<TagData> {
    let channel = this.channels.get(tagId);
    if (channel == null) {
      channel = new Channel(1, new Subject<TagData>());
      this.channels.set(tagId, channel);
    } else {
      channel.connections++;
    }

    return channel.data.asObservable();
  }

  closeChannel(tagId: ItemId) {
    const channel = this.channels.get(tagId);
    if (channel != null) {
      channel.connections--;
      if (channel.connections === 0) {
        this.channels.delete(tagId);
      }
    }
  }

  refresh(maxValueCount: number = 0) {
    const tags = Array.from(this.channels.keys());
    if (tags.length > 0) {
      if (this.activeDashboardService.requestType === RequestType.Live) {
        this.dataRequestSubscription = this.dataProxy.getLiveValue(tags).subscribe(values => {
          this.broadcastSingleValue(values);
        });
      } else {
        const timeFrame = this.activeDashboardService.getRequestTimeFrame();
        if (this.activeDashboardService.requestType === RequestType.ValueAtTime) {
          const request = new ValueAtTimeRequest();
          request.targetTime = timeFrame.targetTime;
          request.tags = tags;
          this.dataRequestSubscription = this.dataProxy.getValueAtTime(request).subscribe(values => {
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
            this.dataRequestSubscription = this.dataProxy.getHistoryAbsolute(request).subscribe(response => {
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
            this.dataRequestSubscription = this.dataProxy.getHistoryRelative(request).subscribe(response => {
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
        channel.data.next({ startTime: startTime, endTime: endTime, values: value.values });
      }
    }

    this.dataRefreshedSource.next(new ResponseTimeFrame(null, startTime, endTime));
  }

  private broadcastSingleValue(values: TagValue[]) {
    for (let value of values) {
      const channel = this.channels.get(value.tag);
      if (channel != null) {
        channel.data.next({ startTime: value.value.time, endTime: value.value.time, values: [value.value] });
      }
    }

    // single data requests always return a value and they all have the same timestamp
    this.dataRefreshedSource.next(new ResponseTimeFrame(values[0].value.time, null, null));
  }

  private get isRefreshing(): boolean {
    return this.intervalID !== null;
  }

  startRefresh(maxValueCount: number = 0) {
    // stop any ongoing auto refresh
    this.stopRefresh();

    // do a full refresh once
    this.refresh(maxValueCount);

    const timeFrame = this.activeDashboardService.getRequestTimeFrame();
    if (this.activeDashboardService.requestType === RequestType.Live || 
      (this.activeDashboardService.requestType === RequestType.History && timeFrame.timePeriod.type === TimePeriodType.Relative)) {
      // we only auto-fresh for live data or relative requests for historical data
      this.intervalID = window.setInterval(() => { this.refresh(maxValueCount); }, this.interval * 1000);
    }
  }

  stopRefresh() {
    if (this.intervalID !== null) {
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
