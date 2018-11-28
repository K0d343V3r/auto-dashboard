import { Component, OnInit } from '@angular/core';
import { SimulatorTag } from '../proxies/data-simulator-api';
import { ActiveDashboardService } from '../services/active-dashboard.service';
import { MatSelectionListChange } from '@angular/material';
import { SimulatorTagService } from '../services/simulator-tag.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {
  tags$: Observable<SimulatorTag[]>;

  constructor(
    private activeDashboardService: ActiveDashboardService,
    private simulatorTagService: SimulatorTagService
  ) { }

  ngOnInit() {
    this.tags$ = this.simulatorTagService.getAllTags();
  }

  isTagSelected(tag: SimulatorTag): boolean {
    return this.activeDashboardService.tiles.find(t => t.tagId === tag.id) != null;
  }

  isTagImportant(tag: SimulatorTag): boolean {
    const tile = this.activeDashboardService.tiles.find(t => t.tagId === tag.id);
    return tile != null && tile.important;
  }

  toggleTagImportance(tag: SimulatorTag, event: MouseEvent) {
    this.activeDashboardService.toggleTagImportance(tag.id);
    event.stopImmediatePropagation();
  }

  onTagSelectionChange(event: MatSelectionListChange) {
    if (event.option.selected) {
      this.activeDashboardService.addTag(event.option.value);
    } else {
      this.activeDashboardService.removeTag(event.option.value);
    }
  }
}
