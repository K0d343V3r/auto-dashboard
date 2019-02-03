import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { ActiveDashboardService } from '../services/active-dashboard/active-dashboard.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DashboardPropertiesComponent, DashboardPropertiesData } from '../properties/dashboard-properties/dashboard-properties.component';
import { Location } from '@angular/common';
import { SimulatorItemService } from '../services/simulator-item.service';
import { SimulatorItem, ItemId } from '../proxies/data-simulator-api';
import { Observable, of, Subscription } from 'rxjs';
import { DashboardDataService, ResponseTimeFrame } from '../services/dashboard-data.service';
import { ControlHostComponent } from '../controls/control-host/control-host.component';
import { RequestType, TimePeriodType } from '../proxies/dashboard-api';
import { TimeService } from '../services/time.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private itemsSubscription: Subscription;
  private definitionChangedSubscription: Subscription;
  private tileAddedSubscription: Subscription;
  private requestTypeSubscription: Subscription;
  private dataRefreshedSubscription: Subscription;
  private items: SimulatorItem[];

  subtitle: string;
  isEditing: boolean;
  isReadOnly: boolean;
  activeDashboardService$: Observable<ActiveDashboardService>;
  @ViewChildren(ControlHostComponent) controls!: QueryList<ControlHostComponent>;

  constructor(
    private activeDashboardService: ActiveDashboardService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location,
    private simulatorItemService: SimulatorItemService,
    private dashboardDataService: DashboardDataService,
    private timeService: TimeService,
    private navigationService: NavigationService
  ) {
  }

  ngOnInit() {
    this.isEditing = this.router.url.split("/")[1] === 'editor';
    this.isReadOnly = this.router.url.split("/")[1] === 'dashboard';

    this.itemsSubscription = this.simulatorItemService.getAllItems().subscribe(items => {
      this.items = items;
      this.activeDashboardService$ = of(this.activeDashboardService);
      this.refreshData();
      this.changeSubtitle();
    });

    this.definitionChangedSubscription = this.activeDashboardService.definitionChanged$.subscribe(() => {
      this.refreshData();
      this.changeSubtitle();
    });

    this.tileAddedSubscription = this.activeDashboardService.tileAdded$.subscribe(tile => {
      this.refreshData(tile.sourceId);
    });

    this.requestTypeSubscription = this.activeDashboardService.requestTypeChanged$.subscribe(() => {
      this.refreshData();
      this.changeSubtitle();
    });

    this.dataRefreshedSubscription = this.dashboardDataService.dataRefreshed$.subscribe(timeFrame => {
      this.changeSubtitle(timeFrame);
    });
  }

  private changeSubtitle(timeFrame: ResponseTimeFrame = null) {
    if (this.isEditing) {
      this.changeEditingSubtitle();
    } else if (timeFrame === null) {
      this.changeViewingSubtitle(this.createDefaultResponseTimeFrame());
    } else {
      this.changeViewingSubtitle(timeFrame);
    }
  }

  private changeViewingSubtitle(responseTime: ResponseTimeFrame) {
    if (this.activeDashboardService.requestType === RequestType.History) {
      this.subtitle = `${this.timeService.toTimeSpanString(responseTime.startTime, responseTime.endTime, true)}`;
    } else {
      this.subtitle = `${this.timeService.toDateString(responseTime.targetTime)}`;
    }

    if (this.dashboardDataService.isRefreshing) {
      const rate = this.timeService.toRefreshRateString(
        this.activeDashboardService.refreshRate, this.activeDashboardService.refreshScale);
      this.subtitle = `${this.subtitle} (${rate})`;
    }
  }

  private changeEditingSubtitle() {
    if (this.activeDashboardService.requestType === RequestType.Live) {
      this.subtitle = "Show current values";
    } else {
      const timeFrame = this.activeDashboardService.getRequestTimeFrame();
      if (this.activeDashboardService.requestType === RequestType.ValueAtTime) {
        this.subtitle = `Show values at ${this.timeService.toDateString(timeFrame.targetTime)}`;
      } else if (this.activeDashboardService.requestType === RequestType.History) {
        if (timeFrame.timePeriod.type === TimePeriodType.Relative) {
          this.subtitle = `Show values for the ${this.timeService.toRelativeTimeString(
            timeFrame.timePeriod.offsetFromNow, timeFrame.timePeriod.timeScale)}`;
        } else {
          this.subtitle = `Show values from ${this.timeService.toTimeSpanString(timeFrame.timePeriod.startTime, timeFrame.timePeriod.endTime)}`;
        }
      }
    }
  }

  private createDefaultResponseTimeFrame(): ResponseTimeFrame {
    if (this.activeDashboardService.requestType === RequestType.Live) {
      return new ResponseTimeFrame(new Date(), null, null);
    } else {
      const timeFrame = this.activeDashboardService.getRequestTimeFrame();
      if (this.activeDashboardService.requestType === RequestType.ValueAtTime) {
        return new ResponseTimeFrame(timeFrame.targetTime, null, null);
      } else {
        if (timeFrame.timePeriod.type === TimePeriodType.Absolute) {
          return new ResponseTimeFrame(null, timeFrame.timePeriod.startTime, timeFrame.timePeriod.endTime);
        } else {
          const endDate = new Date();
          const startDate = this.timeService.resolveRelativeTime(
            endDate, timeFrame.timePeriod.offsetFromNow, timeFrame.timePeriod.timeScale);
          return new ResponseTimeFrame(null, startDate, endDate);
        }
      }
    }
  }

  private refreshData(item: ItemId = null) {
    if (this.activeDashboardService.tiles.length > 0) {
      // NOTE: must be called within setTimeout(), otherwise child components may not exist
      window.setTimeout(() => {
        const count = this.getMaxValueCount();
        if (!this.isEditing) {
          // if not editing, we auto-refresh
          this.dashboardDataService.startRefresh(count);
        } else if (item !== null) {
          // refresh single item
          this.dashboardDataService.refreshItem(item, count);
        } else {
          // refresh all items
          this.dashboardDataService.refresh(count);
        }
      });
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
    this.itemsSubscription.unsubscribe();
    this.tileAddedSubscription.unsubscribe();
    this.definitionChangedSubscription.unsubscribe();
    this.requestTypeSubscription.unsubscribe();
    this.dataRefreshedSubscription.unsubscribe();
  }

  edit() {
    // open editor for this dashboard
    this.navigationService.editDashboard(this.activeDashboardService.id);
  }

  done() {
    if (this.activeDashboardService.id > 0) {
      // dashboard exists, update it
      this.activeDashboardService.save().subscribe(() => {
        this.goBack();
      });
    } else {
      // dashboard does not exist, get a new name for it
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      const dialogRef = this.dialog.open(DashboardPropertiesComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data: DashboardPropertiesData) => {
        if (data != null) {
          this.activeDashboardService.name = data.name;
          this.activeDashboardService.save().subscribe(() => {
            // dashboard successfully created, now view it
            this.viewDashboard(this.activeDashboardService.dashboardFolderId, this.activeDashboardService.id);
          });
        }
      });
    }
  }

  private goBack() {
    // stop any new template rebinding since we are on our way out
    this.activeDashboardService$ = null;
    this.navigationService.goBack();
  }

  private viewDashboard(folderId: number, definitionId: number) {
    // stop any new template rebinding since we are on our way out
    this.activeDashboardService$ = null;
    this.navigationService.viewDashboard(folderId, definitionId);
  }

  cancel() {
    this.goBack();
  }

  getSimulatorItem(itemId: number): SimulatorItem {
    return this.items.find(t => t.id === itemId);
  }
}
