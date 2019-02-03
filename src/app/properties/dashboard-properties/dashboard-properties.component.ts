import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

export class DashboardPropertiesData {
  constructor(public name: string) {
  }
}

@Component({
  selector: 'app-properties',
  templateUrl: './dashboard-properties.component.html',
  styleUrls: ['./dashboard-properties.component.css']
})
export class DashboardPropertiesComponent {
  form: FormGroup;
  name: string;
  title: string;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<DashboardPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) data: DashboardPropertiesData) {
    this.title = "Dashboard Properties";
    if (data == null) {
      this.name = "";
    } else {
      this.name = data.name;
    }

    this.form = fb.group({
      name: [this.name, [Validators.required]]
    });
  }

  save() {
    if (this.form.valid) {
      const data = new DashboardPropertiesData(this.form.value.name.trim());
      this.dialogRef.close(data);
    }
  }

  cancel() {
    if (this.form.valid) {
      this.dialogRef.close();
    }
  }

  getNameErrorMessage(): string {
    return "Please enter a name.";
  }
}
