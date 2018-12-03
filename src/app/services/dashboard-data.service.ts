import { Injectable } from '@angular/core';
import { TagId, VQT, DataProxy } from '../proxies/data-simulator-api';
import { Observable, Subject } from 'rxjs';

class Channel {
  constructor(public connections: number, public data: Subject<VQT[]>) {}
}

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private intervalID?: number = null;
  private channels: Map<TagId, Channel> = new Map<TagId, Channel>();

  constructor(
    private dataProxy: DataProxy
  ) { }

  openChannel(tagId: TagId): Observable<VQT[]> {
    let channel = this.channels.get(tagId);
    if (channel == null) {
      channel = new Channel(1, new Subject<VQT[]>());
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
    this.dataProxy.getLiveValue(Array.from(this.channels.keys())).subscribe(tagValues => {
      for (let value of tagValues) {
        const channel = this.channels.get(value.tag);
        if (channel != null) {
          channel.data.next([value.value]);
        }
      }
    });
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
