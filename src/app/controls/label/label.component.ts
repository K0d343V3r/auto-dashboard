import { Component, OnInit, Input } from '@angular/core';
import { IDashboardControl } from '../common/i-dashboard-control';
import { SimulatorTag } from 'src/app/proxies/data-simulator-api';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit, IDashboardControl {
  @Input() tag: SimulatorTag;

  constructor() { }

  ngOnInit() {
  }

  resize() {

  }
}
