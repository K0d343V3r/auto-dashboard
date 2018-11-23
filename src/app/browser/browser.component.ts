import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardDefinition } from '../proxies/dashboard-api';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ActiveDashboardService } from '../services/active-dashboard.service';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit, OnDestroy {
  private definitionChangedSubscription: Subscription;

  definitions: DashboardDefinition[] = [];
  selectedDefinitionIndex: number = -1;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private activeDashboardService: ActiveDashboardService
  ) {
  }

  ngOnInit() {
    // initialize with resolved definitions
    this.definitions = this.activatedRoute.snapshot.data.definitions;
    this.changeSelectedDefinitionIndex(this.activeDashboardService.id);

    this.definitionChangedSubscription = this.activeDashboardService.definitionChanged$.subscribe(() => {
      this.changeSelectedDefinitionIndex(this.activeDashboardService.id);
    });
  }

  private changeSelectedDefinitionIndex(id: number) {
    if (id == 0) {
      this.selectedDefinitionIndex = -1
    } else {
      this.selectedDefinitionIndex = this.definitions.findIndex(d => d.id == id);
    }
  }

  ngOnDestroy() {
    this.definitionChangedSubscription.unsubscribe();
  }

  addDefinition() {
    // open editor with no id (new dashboard mode)
    this.router.navigate(['editor']);
  }

  removeDefinition() {

  }

  move(up: boolean) {

  }
}
