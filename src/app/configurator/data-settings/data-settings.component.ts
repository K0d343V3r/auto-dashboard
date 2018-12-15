import { Component, OnInit } from '@angular/core';
import { SimulatorItem } from '../../proxies/data-simulator-api';
import { ActiveDashboardService } from '../../services/active-dashboard.service';
import { MatSelectionListChange } from '@angular/material';
import { SimulatorItemService } from '../../services/simulator-item.service';
import { Observable } from 'rxjs';
import { DashboardUndoService } from 'src/app/services/dashboard-undo.service';

@Component({
  selector: 'app-data-settings',
  templateUrl: './data-settings.component.html',
  styleUrls: ['./data-settings.component.css']
})
export class DataSettingsComponent implements OnInit {
  items$: Observable<SimulatorItem[]>;

  constructor(
    private activeDashboardService: ActiveDashboardService,
    private simulatorItemService: SimulatorItemService,
    private dashboardUndoService: DashboardUndoService
  ) { }

  ngOnInit() {
    this.items$ = this.simulatorItemService.getAllItems();
  }

  isItemSelected(item: SimulatorItem): boolean {
    return this.activeDashboardService.tiles.find(t => t.tagId === item.id) != null;
  }

  isItemImportant(item: SimulatorItem): boolean {
    const tile = this.activeDashboardService.tiles.find(t => t.tagId === item.id);
    return tile != null && tile.important;
  }

  toggleItemImportance(item: SimulatorItem, event: MouseEvent) {
    this.dashboardUndoService.toggleItemImportance(item.id);
    event.stopImmediatePropagation();
  }

  onItemSelectionChange(event: MatSelectionListChange) {
    if (event.option.selected) {
      this.dashboardUndoService.addItem(event.option.value);
    } else {
      this.dashboardUndoService.removeItem(event.option.value);
    }
  }
}
