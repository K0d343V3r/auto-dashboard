import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatSidenavModule,
  // MatListModule,
  // MatIconModule,
  // MatButtonModule,
  // MatDialogModule,
  // MatFormFieldModule,
  // MatInputModule,
  // MatTableModule,
  // MatCheckboxModule,
  // MatSelectModule,
  // MatDatepickerModule,
  // MatNativeDateModule,
  // MatSlideToggleModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    // MatCheckboxModule,
    // MatTableModule,
    // MatInputModule,
    // MatFormFieldModule,
    // MatDialogModule,
    // MatButtonModule,
    MatToolbarModule,
    // MatIconModule,
    MatSidenavModule,
    // MatSelectModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatSlideToggleModule,
    // MatListModule
  ],
  exports: [
    BrowserAnimationsModule,
    // MatCheckboxModule,
    // MatTableModule,
    // MatInputModule,
    // MatFormFieldModule,
    // MatDialogModule,
    // MatButtonModule,
    MatToolbarModule,
    // MatIconModule,
    MatSidenavModule,
    // MatSelectModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatSlideToggleModule,
    // MatListModule
  ]
})
export class MaterialModule { }