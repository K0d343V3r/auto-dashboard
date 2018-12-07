import { Injectable } from '@angular/core';
import { TagId, VQT, DataProxy, TagValue, ValueAtTimeRequest, AbsoluteHistoryRequest, TagValues, RelativeHistoryResponse, RelativeHistoryRequest, TimeScale } from '../proxies/data-simulator-api';
import { Observable, Subject } from 'rxjs';
import { ActiveDashboardService } from './active-dashboard.service';
import { RequestType, TimePeriodType, RelativeTimeScale } from '../proxies/dashboard-api';

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

  constructor(
    private dataProxy: DataProxy,
    private activeDashboardService: ActiveDashboardService
  ) { }

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

  refresh() {
    const tags = Array.from(this.channels.keys());
    if (this.activeDashboardService.requestType === RequestType.Live) {
      this.dataProxy.getLiveValue(tags).subscribe(values => {
        this.broadcastSingleValue(values);
      });
    } else if (this.activeDashboardService.requestType === RequestType.ValueAtTime) {
      const request = new ValueAtTimeRequest();
      request.targetTime = this.activeDashboardService.getRequestTimeFrame().targetTime;
      request.tags = tags;
      this.dataProxy.getValueAtTime(request).subscribe(values => {
        this.broadcastSingleValue(values);
      });
    } else {
      const timeFrame = this.activeDashboardService.getRequestTimeFrame();
      if (this.activeDashboardService.requestType === RequestType.History) {
        if (timeFrame.timePeriod.type === TimePeriodType.Absolute) {
          const request = new AbsoluteHistoryRequest();
          request.tags = tags;
          request.startTime = timeFrame.timePeriod.startTime;
          request.endTime = timeFrame.timePeriod.endTime;
          this.dataProxy.getHistoryAbsolute(request).subscribe(values => {
            this.broadcastMultipleValues(timeFrame.timePeriod.startTime, timeFrame.timePeriod.endTime, values);
          });
        } else {
          const request = new RelativeHistoryRequest();
          request.tags = tags;
          request.offsetFromNow = timeFrame.timePeriod.offsetFromNow;
          request.timeScale = this.toTimeScale(timeFrame.timePeriod.timeScale);
          this.dataProxy.getHistoryRelative(request).subscribe(response => {
            this.broadcastMultipleValues(response.resolvedStartTime, response.resolvedEndTime, response.values);
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

  startRefresh(interval: number) {
    this.refresh();
    this.intervalID = window.setInterval(() => {
      this.refresh();
    }, interval * 1000);
  }

  stopRefresh() {
    if (this.intervalID !== null) {
      window.clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }
}
