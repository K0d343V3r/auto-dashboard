import { Component, OnInit, Input } from '@angular/core';
import { ITagControl } from '../i-dashboard-control';
import { SimulatorTag } from 'src/app/proxies/data-simulator-api';
import { TagData } from 'src/app/services/dashboard-data.service';
import { DefaultColorService } from 'src/app/services/default-color.service';

@Component({
  selector: 'app-led',
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.css']
})
export class LedComponent implements OnInit, ITagControl {
  @Input() item: SimulatorTag;
  value: boolean = false;

  constructor(
    public defaultColorService: DefaultColorService
  ) { }

  ngOnInit() {
  }

  resize() {
  }

  getContentWidth(): number {
    return 0;
  }

  set data(data: TagData) {
    this.value = data.values[0].value;
  }
}
