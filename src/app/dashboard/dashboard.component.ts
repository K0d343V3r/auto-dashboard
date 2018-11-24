import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActiveDashboardService } from '../services/active-dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private definitionChangedSubscription: Subscription;

  title: string = '';

  constructor(private activeDashboardService: ActiveDashboardService) { }

  ngOnInit() {
    this.onDefinitionChanged();
    this.definitionChangedSubscription = this.activeDashboardService.definitionChanged$.subscribe(() => {
      this.onDefinitionChanged();
    });
  }

  private onDefinitionChanged() {
    if (this.activeDashboardService.title !== null) {
      this.title = this.activeDashboardService.title;
    } else {
      this.title = this.activeDashboardService.name;
    }
  }

  ngOnDestroy() {
    this.definitionChangedSubscription.unsubscribe();
  }
}
