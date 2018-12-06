import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RelativeTimeScale, RequestType } from '../../proxies/dashboard-api';
import { DashboardUndoService } from 'src/app/services/dashboard-undo.service';

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
export class TimeSettingsComponent implements OnInit {
  offset = new FormControl(5, [Validators.min(1), Validators.required, Validators.pattern('^[0-9]*$')]);

  timeScaleOptions: TimeScaleOption[] = [
    { value: RelativeTimeScale.Seconds, viewValue: "Seconds" },
    { value: RelativeTimeScale.Minutes, viewValue: "Minutes" },
    { value: RelativeTimeScale.Hours, viewValue: "Hours" },
    { value: RelativeTimeScale.Days, viewValue: "Days" }
  ];
  selectedTimeScaleOption: RelativeTimeScale = RelativeTimeScale.Minutes;

  RequestTypeOption: any = RequestTypeOption;
  selectedRequestType: number = 0;

  constructor(
    private dashboardUndoService: DashboardUndoService
  ) { }

  ngOnInit() {
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
