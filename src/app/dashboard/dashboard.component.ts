import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { ActiveDashboardService } from '../services/active-dashboard.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { PropertiesComponent, PropertiesData } from '../properties/properties.component';
import { Location } from '@angular/common';
import { SimulatorTagService } from '../services/simulator-tag.service';
import { SimulatorTag } from '../proxies/data-simulator-api';
import { Observable, of, Subscription } from 'rxjs';
import { DashboardDataService, ResponseTimeFrame } from '../services/dashboard-data.service';
import { ControlHostComponent } from '../controls/control-host/control-host.component';
import { RequestType, TimePeriodType, TimePeriod, RelativeTimeScale } from '../proxies/dashboard-api';

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
  private dataRefreshedSubscription: Subscription;
  private tags: SimulatorTag[];

  subtitle: String;
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
    this.changeSubtitle();

    this.tagsSubscription = this.simulatorTagService.getAllTags().subscribe(tags => {
      this.tags = tags;
      this.activeDashboardService$ = of(this.activeDashboardService);
      this.refreshData();
    });

    this.definitionChangedSubscription = this.activeDashboardService.definitionChanged$.subscribe(() => {
      this.changeSubtitle();
      this.refreshData();
    });

    this.tileAddedSubscription = this.activeDashboardService.tileAdded$.subscribe(() => {
      this.refreshData();
    });

    this.requestTypeSubscription = this.activeDashboardService.requestTypeChanged$.subscribe(() => {
      this.changeSubtitle();
      this.refreshData();
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
    if (this.activeDashboardService.requestType === RequestType.Live) {
      this.subtitle = `${this.capitalize(this.getPointInTimeText(responseTime.targetTime))} (current)`;
    } else if (this.activeDashboardService.requestType === RequestType.ValueAtTime) {
      this.subtitle = `${this.capitalize(this.getPointInTimeText(responseTime.targetTime))}`;
    } else if (this.activeDashboardService.requestType === RequestType.History) {
      const timeFrame = this.activeDashboardService.getRequestTimeFrame();
      const text = this.capitalize(this.getTimeSpanText(responseTime.startTime, responseTime.endTime));
      if (timeFrame.timePeriod.type === TimePeriodType.Absolute) {
        this.subtitle = `${text}`;
      } else {
        this.subtitle = `${text} (${this.getRelativeTimePeriodText(timeFrame.timePeriod)})`;
      }
    }
  }

  private changeEditingSubtitle() {
    if (this.activeDashboardService.requestType === RequestType.Live) {
      this.subtitle = "Show current values";
    } else {
      const timeFrame = this.activeDashboardService.getRequestTimeFrame();
      if (this.activeDashboardService.requestType === RequestType.ValueAtTime) {
        this.subtitle = `Show values ${this.getPointInTimeText(timeFrame.targetTime)}`;
      } else if (this.activeDashboardService.requestType === RequestType.History) {
        if (timeFrame.timePeriod.type === TimePeriodType.Relative) {
          this.subtitle = `Show values for the ${this.getRelativeTimePeriodText(timeFrame.timePeriod)}`;
        } else {
          this.subtitle = `Show values ${this.getTimeSpanText(timeFrame.timePeriod.startTime, timeFrame.timePeriod.endTime)}`;
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
          const startDate = this.dashboardDataService.getRelativeStartTime(timeFrame.timePeriod, endDate);
          return new ResponseTimeFrame(null, startDate, endDate);
        }
      }
    }
  }

  private capitalize(text: string): string {
    if (text.length == 0) {
      return "";
    } else {
      return `${text.charAt(0).toLocaleUpperCase()}${text.substr(1)}`;
    }
  }

  private getPointInTimeText(time: Date): string {
    return `at ${time.toLocaleTimeString()} on ${time.toLocaleDateString()}`;
  }

  private getRelativeTimePeriodText(timePeriod: TimePeriod): string {
    return -timePeriod.offsetFromNow === 1 ?
      `last ${this.toTimeScaleString(timePeriod.timeScale, true)}` :
      `last ${-timePeriod.offsetFromNow} ${this.toTimeScaleString(timePeriod.timeScale, false)}`;
  }

  private getTimeSpanText(startTime: Date, endTime: Date): string {
    if (this.toDateOnly(startTime).getTime() === this.toDateOnly(endTime).getTime()) {
      return `from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()} on ${startTime.toLocaleDateString()}`;
    } else {
      return `from ${startTime.toLocaleString()} to ${endTime.toLocaleString()}`;
    }
  }

  private toDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  private toTimeScaleString(timeScale: RelativeTimeScale, singular: boolean): string {
    switch (timeScale) {
      case RelativeTimeScale.Seconds:
        return singular ? "second" : "seconds";

      case RelativeTimeScale.Minutes:
        return singular ? "minute" : "minutes";

      case RelativeTimeScale.Hours:
        return singular ? "hour" : "hours";

      case RelativeTimeScale.Days:
        return singular ? "day" : "days";

      default:
        throw "Invalid time scale.";
    }
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
    this.dataRefreshedSubscription.unsubscribe();
  }

  edit() {
    // open editor for this dashboard
    this.router.navigate([`editor/${this.activeDashboardService.id}`]);
  }

  done() {
    if (this.activeDashboardService.id > 0) {
      // dashboard exists, update it
      this.activeDashboardService.save().subscribe(() => {
        // and go back to where we opened editor
        this.navigate();
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
            this.navigate(`viewer/${this.activeDashboardService.id}`);
          });
        }
      });
    }
  }

  private navigate(url: string = null) {
    // stop any new template rebinding since we are on our way out
    this.activeDashboardService$ = null;

    // and navigate away from editor
    if (url === null) {
      this.location.back();
    } else {
      this.router.navigate([url]);
    }
  }

  cancel() {
    // go back to where we opened editor
    this.navigate();
  }

  getSimulatorTag(tagId: number): SimulatorTag {
    return this.tags.find(t => t.id === tagId);
  }
}
