import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { RelativeTimeScale, RequestType, TimePeriodType, TimePeriod } from '../../proxies/dashboard-api';
import { DashboardUndoService } from 'src/app/services/dashboard-undo.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActiveDashboardService } from 'src/app/services/active-dashboard/active-dashboard.service';
import { Subscription, merge } from 'rxjs';
import { RequestTimeFrame } from 'src/app/services/i-reversible-changes';
import { TimeService } from 'src/app/services/time.service';

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

  offset: FormControl;
  timeScale: FormControl;
  requestType: FormControl;
  startDate: FormControl;
  startTime: FormControl;
  endDate: FormControl;
  endTime: FormControl;
  atDate: FormControl;
  atTime: FormControl;

  timeScaleOptions: TimeScaleOption[];
  RequestTypeOption: any = RequestTypeOption;

  constructor(
    private dashboardUndoService: DashboardUndoService,
    private activeDashboardService: ActiveDashboardService,
    private timeService: TimeService
  ) {
    this.timeScaleOptions = [
      { value: RelativeTimeScale.Seconds, viewValue: this.timeService.toTimeScaleString(RelativeTimeScale.Seconds, false, true) },
      { value: RelativeTimeScale.Minutes, viewValue: this.timeService.toTimeScaleString(RelativeTimeScale.Minutes, false, true) },
      { value: RelativeTimeScale.Hours, viewValue: this.timeService.toTimeScaleString(RelativeTimeScale.Hours, false, true) },
      { value: RelativeTimeScale.Days, viewValue: this.timeService.toTimeScaleString(RelativeTimeScale.Days, false, true) }
    ];

    // relative default is last 5 minutes
    this.offset = new FormControl(5, [Validators.min(1), Validators.required, Validators.pattern('^[0-9]*$')]);
    this.timeScale = new FormControl(RelativeTimeScale.Minutes);

    // default is live (current) data
    this.requestType = new FormControl(RequestTypeOption.Current);

    // absolute default is 5 minutes ago to now
    const endDate = new Date();
    this.endDate = new FormControl(endDate, [TimeSettingsComponent.dateValidator(this)]);
    this.endTime = new FormControl(this.timeService.to24HourTimeString(endDate));
    const startDate = new Date(endDate);
    startDate.setMinutes(startDate.getMinutes() - 5);
    this.startDate = new FormControl(startDate, [TimeSettingsComponent.dateValidator(this)]);
    this.startTime = new FormControl(this.timeService.to24HourTimeString(startDate));

    this.atDate = new FormControl(endDate);
    this.atTime = new FormControl(this.timeService.to24HourTimeString(endDate));
  }

  private static dateValidator(component: TimeSettingsComponent): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // NOTE: decided against form groups this time, so validator being called one control at a time
      if (component.startDate == null || component.startTime == null || component.endDate == null || component.endTime == null) {
        return null;
      } else {
        const start = component.timeService.combine(component.startDate.value, component.startTime.value);
        const end = component.timeService.combine(component.endDate.value, component.endTime.value);
        if (start.getTime() < end.getTime()) {
          return null;
        } else {
          return { 'dates': { value: control.value } };
        }
      };
    }
  }

  ngOnInit() {
    this.updateFromModel();
    this.updateControlStates();

    this.requestType.valueChanges.subscribe(() => {
      // enable/disable controls based on radio button selection
      this.updateControlStates();

      // and update dashboard model
      this.updateModel();
    });

    merge(
      this.offset.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()),
      this.timeScale.valueChanges,
      this.startDate.valueChanges,
      this.startTime.valueChanges,
      this.endDate.valueChanges,
      this.endTime.valueChanges,
      this.atDate.valueChanges,
      this.atTime.valueChanges
    ).subscribe(() => {
      // re-execute date validation (may be incorrect due to time changes)
      this.startDate.updateValueAndValidity({ emitEvent: false });
      this.endDate.updateValueAndValidity({ emitEvent: false });

      // and update dashboard model
      this.updateModel();
    });

    this.requestTypeSubscription = this.activeDashboardService.requestTypeChanged$.subscribe(() => {
      // we subscribe to this event to react to changes from Undo service
      this.updateFromModel();
    });
  }

  private updateModel() {
    // update dashboard model based on current user (valid) settings
    if (this.requestType.value === RequestTypeOption.Current) {
      this.dashboardUndoService.changeRequestType(RequestType.Live);
    } else if (this.requestType.value === RequestTypeOption.HistoricalRelative && this.offset.valid && this.timeScale.valid) {
      this.dashboardUndoService.changeRequestType(RequestType.History, this.createTimeFrame());
    } else if (this.requestType.value === RequestTypeOption.HistoricalAbsolute &&
      this.startDate.valid && this.startTime.valid && this.endDate.valid && this.endTime.valid) {
      this.dashboardUndoService.changeRequestType(RequestType.History, this.createTimeFrame());
    } else if (this.requestType.value === RequestTypeOption.ValueAtTime && this.atDate.valid && this.atTime.valid) {
      this.dashboardUndoService.changeRequestType(RequestType.ValueAtTime, this.createTimeFrame());
    }
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
        timeFrame.timePeriod.endTime = this.timeService.combine(this.endDate.value, this.endTime.value);
        timeFrame.timePeriod.startTime = this.timeService.combine(this.startDate.value, this.startTime.value);
      } else if (this.requestType.value === RequestTypeOption.HistoricalRelative) {
        timeFrame.timePeriod = new TimePeriod();
        timeFrame.timePeriod.type = TimePeriodType.Relative;
        // offsetFromNow stored as a negative number
        timeFrame.timePeriod.offsetFromNow = -this.offset.value;
        timeFrame.timePeriod.timeScale = this.timeScale.value;
      } else {
        timeFrame.targetTime = this.timeService.combine(this.atDate.value, this.atTime.value);
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

    if (this.requestType.value === RequestTypeOption.HistoricalAbsolute) {
      this.startDate.enable({ emitEvent: false });
      this.startTime.enable({ emitEvent: false });
      this.endDate.enable({ emitEvent: false });
      this.endTime.enable({ emitEvent: false });
    }
    else {
      this.startDate.disable({ emitEvent: false });
      this.startTime.disable({ emitEvent: false });
      this.endDate.disable({ emitEvent: false });
      this.endTime.disable({ emitEvent: false });
    }

    if (this.requestType.value === RequestTypeOption.ValueAtTime) {
      this.atDate.enable({ emitEvent: false });
      this.atTime.enable({ emitEvent: false });
    } else {
      this.atDate.disable({ emitEvent: false });
      this.atTime.disable({ emitEvent: false });
    }
  }

  private updateFromModel() {
    const requestType = this.getRequestType();
    this.requestType.setValue(requestType, { emitEvent: false });
    if (requestType !== RequestTypeOption.Current) {
      const timeFrame = this.activeDashboardService.getRequestTimeFrame();
      if (requestType === RequestTypeOption.HistoricalRelative) {
        // offsetFromNow stored as a negative number
        this.offset.setValue(-timeFrame.timePeriod.offsetFromNow, { emitEvent: false });
        this.timeScale.setValue(timeFrame.timePeriod.timeScale, { emitEvent: false });
      } else if (requestType === RequestTypeOption.HistoricalAbsolute) {
        this.startDate.setValue(timeFrame.timePeriod.startTime, { emitEvent: false });
        this.startTime.setValue(this.timeService.to24HourTimeString(timeFrame.timePeriod.startTime), { emitEvent: false });
        this.endDate.setValue(timeFrame.timePeriod.endTime, { emitEvent: false });
        this.endTime.setValue(this.timeService.to24HourTimeString(timeFrame.timePeriod.endTime), { emitEvent: false });
      } else {
        this.atDate.setValue(timeFrame.targetTime, { emitEvent: false });
        this.atTime.setValue(this.timeService.to24HourTimeString(timeFrame.targetTime), { emitEvent: false });
      }
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

  getDatesErrorMessage(start: boolean): string {
    if (start) {
      return "Must be before To.";
    } else {
      return "Must be after From.";
    }
  }
}
