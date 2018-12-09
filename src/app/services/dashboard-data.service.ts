import { Injectable } from '@angular/core';
import { TagId, VQT, DataProxy, TagValue, ValueAtTimeRequest, AbsoluteHistoryRequest, TagValues, InitialValue, RelativeHistoryRequest, TimeScale } from '../proxies/data-simulator-api';
import { Observable, Subject, Subscription } from 'rxjs';
import { ActiveDashboardService } from './active-dashboard.service';
import { RequestType, TimePeriodType, RelativeTimeScale, TimePeriod } from '../proxies/dashboard-api';

export class TagData {
  constructor(public startTime: Date, public endTime: Date, public values: VQT[]) { }
}

class Channel {
  constructor(public connections: number, public data: Subject<TagData>) { }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private intervalID?: number = null;
  private channels: Map<TagId, Channel> = new Map<TagId, Channel>();
  private readonly interval: number = 2;
  private lastRefreshDate: Date = null;
  private dataRequestSubscription: Subscription;

  constructor(
    private dataProxy: DataProxy,
    private activeDashboardService: ActiveDashboardService
  ) {
  }

  openChannel(tagId: TagId): Observable<TagData> {
    let channel = this.channels.get(tagId);
    if (channel == null) {
      channel = new Channel(1, new Subject<TagData>());
      this.channels.set(tagId, channel);
    } else {
      channel.connections++;
    }

    return channel.data.asObservable();
  }

  closeChannel(tagId: TagId) {
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
    if (this.activeDashboardService.requestType === RequestType.Live) {
      this.dataRequestSubscription = this.dataProxy.getLiveValue(tags).subscribe(values => {
        this.broadcastSingleValue(values);
      });
    } else if (this.activeDashboardService.requestType === RequestType.ValueAtTime) {
      const request = new ValueAtTimeRequest();
      request.targetTime = this.activeDashboardService.getRequestTimeFrame().targetTime;
      request.tags = tags;
      this.dataRequestSubscription = this.dataProxy.getValueAtTime(request).subscribe(values => {
        this.broadcastSingleValue(values);
      });
    } else {
      const timeFrame = this.activeDashboardService.getRequestTimeFrame();
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
        if (!this.isRefreshing || this.lastRefreshDate === null) {
          // not auto refreshing or not doing partial updates yet (first pass)
          request.offsetFromNow = timeFrame.timePeriod.offsetFromNow;
          request.timeScale = this.toTimeScale(timeFrame.timePeriod.timeScale);
          request.initialValue = InitialValue.Linear;
        } else {
          // subsequent (partial) auto-refresh pass, only ask for delta
          request.anchorTime = this.lastRefreshDate;
        }
        this.dataRequestSubscription = this.dataProxy.getHistoryRelative(request).subscribe(response => {
          const startTime = this.getRelativeStartTime(timeFrame.timePeriod, response.endTime);
          this.broadcastMultipleValues(startTime, response.endTime, response.values);
          this.lastRefreshDate = response.endTime;
        });
      }
    }
  }

  private getRelativeStartTime(timePeriod: TimePeriod, endTime: Date): Date {
    let date = new Date(endTime);
    switch (timePeriod.timeScale) {
      case RelativeTimeScale.Seconds:
        date.setSeconds(endTime.getSeconds() + timePeriod.offsetFromNow);
        break;

      case RelativeTimeScale.Minutes:
        date.setMinutes(endTime.getMinutes() + timePeriod.offsetFromNow);
        break;

      case RelativeTimeScale.Hours:
        date.setHours(endTime.getHours() + timePeriod.offsetFromNow);
        break;

      case RelativeTimeScale.Days:
        date.setDate(endTime.getDate() + timePeriod.offsetFromNow);
        break;

      default:
        throw "Invalid time scale.";
    }

    return date;
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
  }

  private broadcastSingleValue(values: TagValue[]) {
    for (let value of values) {
      const channel = this.channels.get(value.tag);
      if (channel != null) {
        channel.data.next({ startTime: value.value.time, endTime: value.value.time, values: [value.value] });
      }
    }
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
    if (this.activeDashboardService.requestType !== RequestType.History || timeFrame.timePeriod.type != TimePeriodType.Absolute) {
      // do no auto-refresh for absolute time periods (returns same data)
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
      this.lastRefreshDate = null;
    }
  }
}
