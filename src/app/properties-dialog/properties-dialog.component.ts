import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder } from '@angular/forms'

export class PropertiesDialogData {
  constructor(public name: string) {
  }
}

@Component({
  selector: 'app-properties-dialog',
  templateUrl: './properties-dialog.component.html',
  styleUrls: ['./properties-dialog.component.css']
})
export class PropertiesDialogComponent implements OnInit {
  form: FormGroup;
  name: string;
  title: string;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<PropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: PropertiesDialogData) {
    if (data == null) {
      this.title = "New Dashboard"
      this.name = "";
    } else {
      this.title = "Dashboard Properties"
      this.name = data.name;
    }

    this.form = fb.group({
      name: [this.name, []]
    });
  }

  ngOnInit() {
  }

  save() {
    const data = new PropertiesDialogData(this.form.value.name.trim());
    this.dialogRef.close(data);
  }

  cancel() {
    this.dialogRef.close();
  }
}
