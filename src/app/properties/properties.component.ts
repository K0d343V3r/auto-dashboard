import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder } from '@angular/forms'

export class PropertiesData {
  constructor(public name: string) {
  }
}

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  form: FormGroup;
  name: string;
  title: string;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<PropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) data: PropertiesData) {
    this.title = "Dashboard Properties";
    if (data == null) {
      this.name = "";
    } else {
      this.name = data.name;
    }

    this.form = fb.group({
      name: [this.name, []]
    });
  }

  ngOnInit() {
  }

  save() {
    const data = new PropertiesData(this.form.value.name.trim());
    this.dialogRef.close(data);
  }

  cancel() {
    this.dialogRef.close();
  }
}
