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

  edit() {
    // open editor for this dashboard
    this.router.navigate([`editor/${this.activeDashboardService.id}`]);
  }

  done() {
    if (this.activeDashboardService.id > 0) {
      // dashboard exists, update it
      this.activeDashboardService.save().subscribe(() => {
        this.exitEditor();
      });
    } else {
      // dashboard does not exist, get a new name for it
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      const dialogRef = this.dialog.open(PropertiesDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data != null) {
          this.activeDashboardService.name = data.name;
          this.activeDashboardService.save().subscribe(() => {
            this.exitEditor();
          });
        }
      });
    }
  }

  private exitEditor() {
    if (this.activeDashboardService.id === 0) {
      // we were creating a new dashboard, go back to viewer (TODO)
      this.router.navigate(['viewer']);
    } else {
    // and go back where we came from (TODO)
    this.router.navigate([`viewer/${this.activeDashboardService.id}`]);
    }
  }

  cancel() {
    this.exitEditor();
  }
}
