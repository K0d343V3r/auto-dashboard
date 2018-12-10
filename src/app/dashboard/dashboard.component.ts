import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { ActiveDashboardService } from '../services/active-dashboard.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { PropertiesComponent, PropertiesData } from '../properties/properties.component';
import { Location } from '@angular/common';
import { SimulatorTagService } from '../services/simulator-tag.service';
import { SimulatorTag } from '../proxies/data-simulator-api';
import { Observable, of, Subscription } from 'rxjs';
import { DashboardDataService } from '../services/dashboard-data.service';
import { ControlHostComponent } from '../controls/control-host/control-host.component';
import { RequestType } from '../proxies/dashboard-api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private tagsSubscription: Subscription;
  private definitionChangedSubscription: Subscription;
  private tileAddedSubscription: Subscription;
  private requestTypeSubscription: Subscription;
  private tags: SimulatorTag[];

  isEditing: boolean;
  isReadOnly: boolean;
  activeDashboardService$: Observable<ActiveDashboardService>;
  @ViewChildren(ControlHostComponent) controls!: QueryList<ControlHostComponent>;

  constructor(
    private activeDashboardService: ActiveDashboardService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location,
    private simulatorTagService: SimulatorTagService,
    private dashboardDataService: DashboardDataService
  ) {
  }

  ngOnInit() {
    this.isEditing = this.router.url.split("/")[1] === 'editor';
    this.isReadOnly = this.router.url.split("/")[1] === 'dashboard';

    this.tagsSubscription = this.simulatorTagService.getAllTags().subscribe(tags => {
      this.tags = tags;
      this.activeDashboardService$ = of(this.activeDashboardService);
      this.refreshData();

      this.definitionChangedSubscription = this.activeDashboardService.definitionChanged$.subscribe(() => {
        this.refreshData();
      });

      this.tileAddedSubscription = this.activeDashboardService.tileAdded$.subscribe(() => {
        this.refreshData();
      });

      this.requestTypeSubscription = this.activeDashboardService.requestTypeChanged$.subscribe(() => {
        this.refreshData();
      });
    });
  }

  private refreshData() {
    if (this.activeDashboardService.tiles.length) {
      if (this.isEditing) {
        // we do not auto-refresh in edit mode
        window.setTimeout(() => {
          // NOTE: must be called within setTimeout(), otherwise child components may not exist
          this.dashboardDataService.refresh(this.getMaxValueCount());
        });
      } else {
        // stop any ongoing auto-fresh, and start auto-refresh again
        this.dashboardDataService.stopRefresh();
        window.setTimeout(() => {
          // NOTE: must be called within setTimeout(), otherwise child components may not exist
          this.dashboardDataService.startRefresh(this.getMaxValueCount());
        });
      }
    }
  }

  /**  
   * This method is used to cap the number of values requested, based on the width of a trending area.
   * That is, there is no point in asking for more values than pixels available to draw them.
  */
  private getMaxValueCount(): number {
    if (this.activeDashboardService.requestType !== RequestType.History) {
      // single value request, no need to throttle
      return 0;
    } else {
      // get maximum content width from children
      let maxCount = 0;
      this.controls.forEach(c => {
        const width = c.getContentWidth();
        if (width > maxCount) {
          maxCount = width;
        }
      });

      // NOTE: we request values for twice the number of pixels in the trending area.
      return maxCount * 2;
    }
  }

  ngOnDestroy() {
    this.dashboardDataService.stopRefresh();
    this.tagsSubscription.unsubscribe();
    this.tileAddedSubscription.unsubscribe();
    this.definitionChangedSubscription.unsubscribe();
    this.requestTypeSubscription.unsubscribe();
  }

  edit() {
    // open editor for this dashboard
    this.router.navigate([`editor/${this.activeDashboardService.id}`]);
  }

  done() {
    if (this.activeDashboardService.id > 0) {
      // dashboard exists, update it
      this.activeDashboardService.save().subscribe(() => {

        // and go back to where we came from
        this.location.back();
      });
    } else {
      // dashboard does not exist, get a new name for it
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      const dialogRef = this.dialog.open(PropertiesComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data: PropertiesData) => {
        if (data != null) {
          this.activeDashboardService.name = data.name;
          this.activeDashboardService.save().subscribe(() => {
            // dashboard successfully created, now view it
            this.router.navigate([`viewer/${this.activeDashboardService.id}`]);
          });
        }
      });
    }
  }

  cancel() {
    // go back to where we came from
    this.location.back();
  }

  getSimulatorTag(tagId: number): SimulatorTag {
    return this.tags.find(t => t.id === tagId);
  }
}
