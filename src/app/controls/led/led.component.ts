import { Component, OnInit, Input } from '@angular/core';
import { IDashboardControl } from '../common/i-dashboard-control';
import { SimulatorTag } from 'src/app/proxies/data-simulator-api';

@Component({
  selector: 'app-led',
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.css']
})
export class LedComponent implements OnInit, IDashboardControl {
  @Input() tag: SimulatorTag;

  constructor() { }

  ngOnInit() {
  }

  resize() {
  }
}
