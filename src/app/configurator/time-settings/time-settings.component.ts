import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RelativeTimeScale, RequestType, TimePeriodType, TimePeriod } from '../../proxies/dashboard-api';
import { DashboardUndoService } from 'src/app/services/dashboard-undo.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActiveDashboardService } from 'src/app/services/active-dashboard.service';
import { Subscription } from 'rxjs';
import { RequestTimeFrame } from 'src/app/services/i-reversible-changes';

export interface TimeScaleOption {
  value: RelativeTimeScale;
  viewValue: string;
}

export enum RequestTypeOption {
  Current,
  HistoricalRelative,
  HistoricalAbsolute,
  ValueAtTime
}

@Component({
  selector: 'app-time-settings',
  templateUrl: './time-settings.component.html',
  styleUrls: ['./time-settings.component.css']
})
export class TimeSettingsComponent implements OnInit, OnDestroy {
  private requestTypeSubscription = new Subscription();

  offset = new FormControl(5, [Validators.min(1), Validators.required, Validators.pattern('^[0-9]*$')]);
  timeScale = new FormControl(RelativeTimeScale.Minutes);
  requestType = new FormControl(RequestTypeOption.Current);

  timeScaleOptions: TimeScaleOption[] = [
    { value: RelativeTimeScale.Seconds, viewValue: "Seconds" },
    { value: RelativeTimeScale.Minutes, viewValue: "Minutes" },
    { value: RelativeTimeScale.Hours, viewValue: "Hours" },
    { value: RelativeTimeScale.Days, viewValue: "Days" }
  ];

  RequestTypeOption: any = RequestTypeOption;

  constructor(
    private dashboardUndoService: DashboardUndoService,
    private activeDashboardService: ActiveDashboardService
  ) { }

  ngOnInit() {
    this.loadFromModel();
    this.updateControlStates();

    this.requestType.valueChanges.subscribe(value => {
      this.updateControlStates();
      if (value === RequestTypeOption.Current) {
        this.dashboardUndoService.changeRequestType(RequestType.Live);
      } else if (value === RequestTypeOption.HistoricalRelative) {
        this.dashboardUndoService.changeRequestType(RequestType.History, this.createTimeFrame());
      } else if (value === RequestTypeOption.HistoricalAbsolute) {
        // TODO
        this.dashboardUndoService.changeRequestType(RequestType.Live);
      } else if (value === RequestTypeOption.ValueAtTime) {
        // TODO
        this.dashboardUndoService.changeRequestType(RequestType.Live);
      }
    });

    this.offset.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.offset.valid) {
        this.dashboardUndoService.changeRequestType(RequestType.History, this.createTimeFrame());
      }
    });

    this.timeScale.valueChanges.subscribe(() => {
      if (this.timeScale.valid) {
        this.dashboardUndoService.changeRequestType(RequestType.History, this.createTimeFrame());
      }
    });

    this.requestTypeSubscription = this.activeDashboardService.requestTypeChanged$.subscribe(() => {
      this.loadFromModel();
    });
  }

  ngOnDestroy() {
    this.requestTypeSubscription.unsubscribe();
  }

  private createTimeFrame(): RequestTimeFrame {
    if (this.requestType.value === RequestTypeOption.Current) {
      return null;
    } else {
      const timeFrame = new RequestTimeFrame();
      if (this.requestType.value === RequestTypeOption.HistoricalAbsolute) {
        timeFrame.timePeriod = new TimePeriod();
        timeFrame.timePeriod.type = TimePeriodType.Absolute;
        timeFrame.timePeriod.endTime = new Date(); // TODO
        timeFrame.timePeriod.startTime = new Date(); // TODO
      } else if (this.requestType.value === RequestTypeOption.HistoricalRelative) {
        timeFrame.timePeriod = new TimePeriod();
        // offsetFromNow stored as a negative number
        timeFrame.timePeriod.offsetFromNow = -this.offset.value;
        timeFrame.timePeriod.timeScale = this.timeScale.value;
      } else {
        timeFrame.targetTime = new Date(); // TODO
      }
      return timeFrame;
    }
  }

  private updateControlStates() {
    if (this.requestType.value === RequestTypeOption.HistoricalRelative) {
      this.offset.enable({ emitEvent: false });
      this.timeScale.enable({ emitEvent: false });
    }
    else {
      this.offset.disable({ emitEvent: false });
      this.timeScale.disable({ emitEvent: false });
    }
  }

  private loadFromModel() {
    const requestType = this.getRequestType();
    this.requestType.setValue(requestType, { emitEvent: false });
    if (requestType === RequestTypeOption.HistoricalRelative) {
      const timeFrame = this.activeDashboardService.getRequestTimeFrame();
      // offsetFromNow stored as a negative number
      this.offset.setValue(-timeFrame.timePeriod.offsetFromNow, { emitEvent: false });
      this.timeScale.setValue(timeFrame.timePeriod.timeScale, { emitEvent: false });
    }
  }

  private getRequestType(): RequestTypeOption {
    switch (this.activeDashboardService.requestType) {
      case RequestType.Live:
        return RequestTypeOption.Current;

      case RequestType.ValueAtTime:
        return RequestTypeOption.ValueAtTime;

      case RequestType.History:
      const timeFrame = this.activeDashboardService.getRequestTimeFrame();
        return timeFrame.timePeriod.type === TimePeriodType.Absolute ?
          RequestTypeOption.HistoricalAbsolute : RequestTypeOption.HistoricalRelative;

      default:
        throw "Invalid request type.";
    }
  }

  getOffsetErrorMessage(): string {
    if (this.offset.hasError('min')) {
      return "Enter 1 or more.";
    } else if (this.offset.hasError('required')) {
      return "Enter a duration.";
    } else
      return "Enter a number."
  }
}
