import { Component, OnInit, Input } from '@angular/core';
import { IDashboardControl } from '../common/i-dashboard-control';
import { SimulatorTag, VQT } from 'src/app/proxies/data-simulator-api';

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

  set values(value: VQT[]) {
    this.value = new Date(value[0].value).toLocaleString();
  }
}
