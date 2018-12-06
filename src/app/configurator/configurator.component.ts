import { Component, OnInit } from '@angular/core';
import { DashboardUndoService } from '../services/dashboard-undo.service';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {
  constructor(
    public dashboardUndoService: DashboardUndoService
  ) { }

  ngOnInit() {
  }
}
