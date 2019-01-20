import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RefreshScale } from 'src/app/services/active-dashboard/dashboard-display-settings';
import { TimeService } from 'src/app/services/time.service';
import { RelativeTimeScale } from 'src/app/proxies/dashboard-api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, merge } from 'rxjs';
import { DashboardUndoService } from 'src/app/services/dashboard-undo.service';
import { ActiveDashboardService } from 'src/app/services/active-dashboard/active-dashboard.service';

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
  private refreshRateSubscription = new Subscription();
  private titleSubscription = new Subscription();
  private refreshRateChangedSubscription = new Subscription();
  private titleChangedSubscription = new Subscription();

  displayForm: FormGroup;
  refreshScaleOptions: RefreshScaleOption[];

  constructor(
    private formBuilder: FormBuilder,
    private activeDashboardService: ActiveDashboardService,
    private dashboardUndoService: DashboardUndoService,
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
      title: [this.activeDashboardService.title],
      refreshRate: [this.activeDashboardService.refreshRate, [Validators.min(1), Validators.pattern('^[0-9]*$')]],
      refreshScale: [this.activeDashboardService.refreshScale]
    });
  }

  ngOnInit() {
    this.titleSubscription = this.displayForm.controls.title.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
      if (this.displayForm.controls.title.valid) {
        this.dashboardUndoService.title = this.displayForm.controls.title.value;
      }
    });

    this.refreshRateSubscription = merge(
      this.displayForm.controls.refreshRate.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()),
      this.displayForm.controls.refreshScale.valueChanges).subscribe(() => {
        if (this.displayForm.controls.refreshRate.valid && this.displayForm.controls.refreshScale.valid) {
          this.dashboardUndoService.setRefreshRate(this.displayForm.controls.refreshRate.value, this.displayForm.controls.refreshScale.value);
        }
      });

    this.titleChangedSubscription = this.activeDashboardService.titleChanged$.subscribe(() => {
      this.displayForm.controls.title.setValue(this.activeDashboardService.title, { emitEvent: false });
    });

    this.refreshRateChangedSubscription = this.activeDashboardService.refreshRateChanged$.subscribe(() => {
      this.displayForm.controls.refreshRate.setValue(this.activeDashboardService.refreshRate, { emitEvent: false });
      this.displayForm.controls.refreshScale.setValue(this.activeDashboardService.refreshScale, { emitEvent: false });
    });
  }

  ngOnDestroy() {
    this.refreshRateSubscription.unsubscribe();
    this.titleSubscription.unsubscribe();
    this.refreshRateChangedSubscription.unsubscribe();
    this.titleChangedSubscription.unsubscribe();
  }

  getRefreshErrorMessage(): string {
    return "Must be greater than 1.";
  }
}
