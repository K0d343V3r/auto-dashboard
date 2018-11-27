import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActiveDashboardService } from '../services/active-dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(public activeDashboardService: ActiveDashboardService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
