import { Component, OnInit } from '@angular/core';
import { TagId } from '../proxies/data-simulator-api';
import { ActiveDashboardService } from '../services/active-dashboard.service';
import { MatSelectionListChange } from '@angular/material';

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

  constructor(
    private activeDashboardService: ActiveDashboardService
  ) {
    this.tags.sort((a, b) => a.name.localeCompare(b.name));
  }

  ngOnInit() {
  }

  isTagSelected(tag: IViewTag): boolean {
    return this.activeDashboardService.hasTag(tag.value);
  }

  onTagSelectionChange(event: MatSelectionListChange) {
    if (event.option.selected) {
      this.activeDashboardService.addTag(event.option.value);
    } else {
      this.activeDashboardService.removeTag(event.option.value);
    }
  }
}
