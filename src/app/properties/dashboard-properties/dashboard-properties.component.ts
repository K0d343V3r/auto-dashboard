import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ElementsProxy, FolderElement } from 'src/app/proxies/dashboard-api';

export class DashboardPropertiesData {
  constructor(public name: string, public folderId: number) {
  }
}

@Component({
  selector: 'app-properties',
  templateUrl: './dashboard-properties.component.html',
  styleUrls: ['./dashboard-properties.component.css']
})
export class DashboardPropertiesComponent {
  form: FormGroup;
  title: string;
  folders: FolderElement[] = [];

  constructor(
    private elementsProxy: ElementsProxy,
    fb: FormBuilder,
    private dialogRef: MatDialogRef<DashboardPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) data: DashboardPropertiesData) {
    this.title = "Dashboard Properties";

    this.form = fb.group({
      name: [data.name, [Validators.required]],
      folder: [data.folderId]
    });

    this.elementsProxy.getAllFolderElements().subscribe(folders => {
      this.folders = folders;
    });
  }

  save() {
    if (this.form.valid) {
      const data = new DashboardPropertiesData(this.form.value.name.trim(), this.form.value.folder);
      this.dialogRef.close(data);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  getNameErrorMessage(): string {
    return "Please enter a name.";
  }
}
