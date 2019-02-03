import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export class FolderPropertiesData {
  constructor(public name: string) {
  }
}

@Component({
  selector: 'app-folder-properties',
  templateUrl: './folder-properties.component.html',
  styleUrls: ['./folder-properties.component.css']
})
export class FolderPropertiesComponent {
  form: FormGroup;
  name: string;
  title: string;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<FolderPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) data: FolderPropertiesData) {
    this.title = "Folder Properties";
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
      const data = new FolderPropertiesData(this.form.value.name.trim());
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
