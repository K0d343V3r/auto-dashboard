import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActiveDashboardService } from '../services/active-dashboard.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { PropertiesComponent, PropertiesData } from '../properties/properties.component';
import { Location } from '@angular/common';
import { SimulatorTagService } from '../services/simulator-tag.service';
import { SimulatorTag } from '../proxies/data-simulator-api';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private tagsSubscription: Subscription;
  private tags: SimulatorTag[];

  isEditing: boolean;
  activeDashboardService$: Observable<ActiveDashboardService>;

  constructor(
    private activeDashboardService: ActiveDashboardService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location,
    private simulatorTagService: SimulatorTagService
  ) {
  }

  ngOnInit() {
    this.isEditing = this.router.url.split("/")[1] === 'editor';

    this.tagsSubscription = this.simulatorTagService.getAllTags().subscribe(tags => {
      this.tags = tags;
      this.activeDashboardService$ = of(this.activeDashboardService);
    });
  }

  ngOnDestroy() {
    this.tagsSubscription.unsubscribe();
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

  getSimulatorTag(tagId: number): SimulatorTag {
    return this.tags.find(t => t.id === tagId);
  }
}
