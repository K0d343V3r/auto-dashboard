import { Component, OnInit, Input } from '@angular/core';
import { IDashboardControl } from '../i-dashboard-control';
import { SimulatorTag, MajorQuality } from 'src/app/proxies/data-simulator-api';
import { TagData } from 'src/app/services/dashboard-data.service';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit, IDashboardControl {
  @Input() tag: SimulatorTag;
  value: string;

  constructor() { }

  ngOnInit() {
  }

  resize() {
  }

  getContentWidth(): number {
    return 0;
  }

  set data(data: TagData) {
    if (data.values[0].quality.major === MajorQuality.Bad) {
      this.value = "";
    } else {
      this.value = new Date(data.values[0].value).toLocaleString();
    }
  }
}
