import { Component, OnInit, Input } from '@angular/core';
import { IDashboardControl } from '../i-dashboard-control';
import { SimulatorTag, VQT } from 'src/app/proxies/data-simulator-api';
import { TagData } from 'src/app/services/dashboard-data.service';

@Component({
  selector: 'app-led',
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.css']
})
export class LedComponent implements OnInit, IDashboardControl {
  @Input() tag: SimulatorTag;
  value: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  resize() {
  }

  set data(data: TagData) {
    this.value = data.values[0].value;
  }
}
