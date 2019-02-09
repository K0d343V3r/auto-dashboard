import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TimeService } from 'src/app/services/time.service';
import { KioskTimeScale, RelativeTimeScale } from 'src/app/proxies/dashboard-api';

export class FolderPropertiesData {
  constructor(public name: string, public kioskMode: boolean, public kioskInterval: number, public kioskTimeScale: KioskTimeScale) {
  }
}

export interface TimeScaleOption {
  value: KioskTimeScale;
  viewValue: string;
}

@Component({
  selector: 'app-folder-properties',
  templateUrl: './folder-properties.component.html',
  styleUrls: ['./folder-properties.component.css']
})
export class FolderPropertiesComponent {
  form: FormGroup;
  title: string;
  kioskScaleOptions: TimeScaleOption[];

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<FolderPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) data: FolderPropertiesData,
    private timeService: TimeService
  ) {
    this.kioskScaleOptions = [
      { value: KioskTimeScale.Seconds, viewValue: this.timeService.toTimeScaleString(RelativeTimeScale.Seconds, false, true) },
      { value: KioskTimeScale.Minutes, viewValue: this.timeService.toTimeScaleString(RelativeTimeScale.Minutes, false, true) },
      { value: KioskTimeScale.Hours, viewValue: this.timeService.toTimeScaleString(RelativeTimeScale.Hours, false, true) }
    ];

    this.title = "Folder Properties";
    this.form = fb.group({
      name: [data.name, [Validators.required]],
      kioskMode: [data.kioskMode],
      kioskInterval: [data.kioskInterval, Validators.min(1)],
      kioskTimeScale: [data.kioskTimeScale]
    });
  }

  save() {
    if (this.form.valid) {
      const data = new FolderPropertiesData(
        this.form.value.name.trim(), this.form.value.kioskMode, this.form.value.kioskInterval, this.form.value.kioskTimeScale);
      this.dialogRef.close(data);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  getNameErrorMessage(): string {
    return "Please enter a name.";
  }

  getKioskErrorMessage(): string {
    return "Must be at least 1.";
  }
}
