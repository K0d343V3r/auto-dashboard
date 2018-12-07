import { Component, OnInit, Input } from '@angular/core';
import { IDashboardControl } from '../i-dashboard-control';
import { SimulatorTag, VQT } from 'src/app/proxies/data-simulator-api';
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

  set data(data: TagData) {
    this.value = new Date(data.values[0].value).toLocaleString();
  }
}
