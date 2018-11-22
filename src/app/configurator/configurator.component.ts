import { Component, OnInit } from '@angular/core';
import { TagsProxy, TagId } from '../proxies/data-simulator-api';

export interface IViewTag {
  name: string;
  value: TagId;
}

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {
  tags: IViewTag[] = [
    { "name": "Sine Wave", "value": TagId.NumericSine },
    { "name": "Square Wave", "value": TagId.NumericSquare },
    { "name": "Sawtooth Wave", "value": TagId.NumericSawtooth },
    { "name": "Triangle Wave", "value": TagId.NumericTriangle },
    { "name": "Periodic Pulse", "value": TagId.DiscretePeriodic },
    { "name": "Modulated Pulse", "value": TagId.DiscreteModulated },
    { "name": "Incremental Count", "value": TagId.NumericCount },
    { "name": "White Noise", "value": TagId.NumericWhiteNoise },
    { "name": "Time Text", "value": TagId.Text }
  ];

  constructor() {
    this.tags.sort((a, b) => a.name.localeCompare(b.name));
  }

  ngOnInit() {
  }

}
