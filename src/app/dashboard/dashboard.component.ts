import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActiveDashboardService } from '../services/active-dashboard.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { PropertiesDialogComponent, PropertiesDialogData } from '../properties-dialog/properties-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private isEditing: boolean;

  constructor(
    public activeDashboardService: ActiveDashboardService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.isEditing = this.router.url.split("/")[1] === 'editor';
  }

  ngOnDestroy() {
  }

  saveOrEdit() {
    if (!this.isEditing) {
      // open editor for this dashboard
      this.router.navigate([`editor/${this.activeDashboardService.id}`]);
    } else if (this.activeDashboardService.id > 0) {
      // dashboard exists, update it
      this.activeDashboardService.save().subscribe();
    } else {
      // dashboard does not exist, get a new name for it
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      const dialogRef = this.dialog.open(PropertiesDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data != null) {
          this.activeDashboardService.name = data.name;
          this.activeDashboardService.save().subscribe(definition => {
            // route to newly created dashboard
            this.router.navigate([`editor/${this.activeDashboardService.id}`]);
          });
        }
      });
    }
  }
}
