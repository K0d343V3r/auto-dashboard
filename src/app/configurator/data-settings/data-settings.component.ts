import { Component, OnInit } from '@angular/core';
import { SimulatorTag } from '../../proxies/data-simulator-api';
import { ActiveDashboardService } from '../../services/active-dashboard.service';
import { MatSelectionListChange } from '@angular/material';
import { SimulatorTagService } from '../../services/simulator-tag.service';
import { Observable } from 'rxjs';
import { DashboardUndoService } from 'src/app/services/dashboard-undo.service';

@Component({
  selector: 'app-data-settings',
  templateUrl: './data-settings.component.html',
  styleUrls: ['./data-settings.component.css']
})
export class DataSettingsComponent implements OnInit {
  tags$: Observable<SimulatorTag[]>;

  constructor(
    private activeDashboardService: ActiveDashboardService,
    private simulatorTagService: SimulatorTagService,
    private dashboardUndoService: DashboardUndoService
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
    this.dashboardUndoService.toggleTagImportance(tag.id);
    event.stopImmediatePropagation();
  }

  onTagSelectionChange(event: MatSelectionListChange) {
    if (event.option.selected) {
      this.dashboardUndoService.addTag(event.option.value);
    } else {
      this.dashboardUndoService.removeTag(event.option.value);
    }
  }
}
