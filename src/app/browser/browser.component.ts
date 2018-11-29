import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardDefinition, DefinitionsProxy } from '../proxies/dashboard-api';
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
    private activeDashboardService: ActiveDashboardService,
    private definitionsProxy: DefinitionsProxy
  ) {
  }

  ngOnInit() {
    // initialize with resolved definitions
    this.definitions = this.activatedRoute.snapshot.data.definitions;
    this.onDefinitionChanged();

    this.definitionChangedSubscription = this.activeDashboardService.definitionChanged$.subscribe(() => {
      this.onDefinitionChanged();
    });
  }

  private onDefinitionChanged() {
    if (this.activeDashboardService.id == 0) {
      this.selectedDefinitionIndex = -1
    } else {
      this.selectedDefinitionIndex = this.definitions.findIndex(d => d.id == this.activeDashboardService.id);
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
    const removedDefinition = this.definitions.splice(this.selectedDefinitionIndex, 1)[0];
    if (this.definitions.length == 0) {
      // list is empty, let's go home
      this.router.navigate(['viewer']);
    }
    else {
      // navigate to next in line dashboard
      let index;
      if (this.selectedDefinitionIndex == this.definitions.length) {
        index = this.selectedDefinitionIndex - 1;
      } else {
        index = this.selectedDefinitionIndex;
      }
      this.router.navigate([`viewer/${this.definitions[index].id}`]);
    }

    // remove from server
    this.definitionsProxy.deleteDefinition(removedDefinition.id).subscribe();
  }

  move(up: boolean) {

  }
}
