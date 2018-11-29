import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActiveDashboardService } from '../services/active-dashboard.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { PropertiesComponent, PropertiesData } from '../properties/properties.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isEditing: boolean;

  constructor(
    public activeDashboardService: ActiveDashboardService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location
  ) { }

  ngOnInit() {
    this.isEditing = this.router.url.split("/")[1] === 'editor';
  }

  ngOnDestroy() {
  }

  edit() {
    // open editor for this dashboard
    this.router.navigate([`editor/${this.activeDashboardService.id}`]);
  }

  done() {
    if (this.activeDashboardService.id > 0) {
      // dashboard exists, update it
      this.activeDashboardService.save().subscribe(() => {

        // and go back to where we came from
        this.location.back();
      });
    } else {
      // dashboard does not exist, get a new name for it
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      const dialogRef = this.dialog.open(PropertiesComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data: PropertiesData) => {
        if (data != null) {
          this.activeDashboardService.name = data.name;
          this.activeDashboardService.save().subscribe(() => {
            // dashboard successfully created, now view it
            this.router.navigate([`viewer/${this.activeDashboardService.id}`]);
          });
        }
      });
    }
  }

  cancel() {
    // go back to where we came from
    this.location.back();
  }
}
