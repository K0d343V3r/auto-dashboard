import { Component, OnInit, Input } from '@angular/core';
import { ITagControl } from '../i-dashboard-control';
import { SimulatorTag, MajorQuality } from 'src/app/proxies/data-simulator-api';
import { TagData } from 'src/app/services/dashboard-data.service';
import { DefaultColorService } from 'src/app/services/default-color.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit, ITagControl {
  @Input() tag: SimulatorTag;
  value: Date;

  constructor(
    public defaultColorService: DefaultColorService,
    public timeService: TimeService
  ) { }

  ngOnInit() {
  }

  resize() {
  }

  getContentWidth(): number {
    return 0;
  }

  set data(data: TagData) {
    if (data.values[0].quality.major === MajorQuality.Bad) {
      this.value = null;
    } else {
      this.value = new Date(data.values[0].value);
    }
  }
}
