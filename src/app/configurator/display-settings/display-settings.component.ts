import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RefreshScale } from 'src/app/services/active-dashboard/dashboard-display-settings';
import { ActiveDashboardService } from 'src/app/services/active-dashboard/active-dashboard.service';
import { TimeService } from 'src/app/services/time.service';
import { RelativeTimeScale } from 'src/app/proxies/dashboard-api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, merge } from 'rxjs';

export interface RefreshScaleOption {
  value: RefreshScale;
  viewValue: string;
}

@Component({
  selector: 'app-display-settings',
  templateUrl: './display-settings.component.html',
  styleUrls: ['./display-settings.component.css']
})
export class DisplaySettingsComponent implements OnInit, OnDestroy {
  private valueChangeSubscription = new Subscription();

  displayForm: FormGroup;
  refreshScaleOptions: RefreshScaleOption[];

  constructor(
    private formBuilder: FormBuilder,
    private activeDashboardService: ActiveDashboardService,
    private timeService: TimeService
  ) {
    this.refreshScaleOptions = [
      { value: RefreshScale.Seconds, viewValue: this.timeService.toTimeScaleString(RelativeTimeScale.Seconds, false, true) },
      { value: RefreshScale.Minutes, viewValue: this.timeService.toTimeScaleString(RelativeTimeScale.Minutes, false, true) },
      { value: RefreshScale.Hours, viewValue: this.timeService.toTimeScaleString(RelativeTimeScale.Hours, false, true) }
    ];

    this.displayForm = this.CreateFormGroup();
  }

  private CreateFormGroup(): FormGroup {
    return this.formBuilder.group({
      title: [this.activeDashboardService.displaySettings.title],
      refreshRate: [this.activeDashboardService.displaySettings.refreshRate, [Validators.min(1), Validators.pattern('^[0-9]*$')]],
      refreshScale: [this.activeDashboardService.displaySettings.refreshScale]
    });
  }

  ngOnInit() {
    this.valueChangeSubscription = merge(
      this.displayForm.controls.title.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()),
      this.displayForm.controls.refreshRate.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()),
      this.displayForm.controls.refreshScale.valueChanges).subscribe(() => {
        if (this.displayForm.valid) {
          this.updateModel();
        }
      });
  }

  ngOnDestroy() {
    this.valueChangeSubscription.unsubscribe();
  }

  private updateModel() {
    this.activeDashboardService.displaySettings.title = this.displayForm.controls.title.value;
    this.activeDashboardService.displaySettings.refreshRate = this.displayForm.controls.refreshRate.value;
    this.activeDashboardService.displaySettings.refreshScale = this.displayForm.controls.refreshScale.value;
  }

  getRefreshErrorMessage(): string {
    return "Must be greater than 1.";
  }
}
