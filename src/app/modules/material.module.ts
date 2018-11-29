import { NgModule } from '@angular/core';
import {
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatGridListModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
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
    // MatCheckboxModule,
    // MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatGridListModule,
    MatTooltipModule,
    // MatSelectModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatSlideToggleModule,
    MatListModule
  ],
  exports: [
    // MatCheckboxModule,
    // MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatGridListModule,
    MatTooltipModule,
    // MatSelectModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatSlideToggleModule,
    MatListModule
  ]
})
export class MaterialModule { }