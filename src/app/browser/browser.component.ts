import { Component, OnInit, OnDestroy } from '@angular/core';
import { DefinitionsProxy, DashboardElement, ElementsProxy } from '../proxies/dashboard-api';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ActiveDashboardService } from '../services/active-dashboard.service';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { PropertiesComponent, PropertiesData } from '../properties/properties.component';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit, OnDestroy {
  private definitionChangedSubscription: Subscription;

  elements: DashboardElement[] = [];
  selectedElementIndex: number = -1;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private activeDashboardService: ActiveDashboardService,
    private definitionsProxy: DefinitionsProxy,
    private elementsProxy: ElementsProxy,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    // initialize with resolved definitions
    this.elements = this.activatedRoute.snapshot.data.elements;
    this.onDefinitionChanged();

    this.definitionChangedSubscription = this.activeDashboardService.definitionChanged$.subscribe(() => {
      this.onDefinitionChanged();
    });
  }

  private onDefinitionChanged() {
    if (this.activeDashboardService.id == 0) {
      this.selectedElementIndex = -1
    } else {
      this.selectedElementIndex = this.elements.findIndex(d => d.id == this.activeDashboardService.id);
    }
  }

  ngOnDestroy() {
    this.definitionChangedSubscription.unsubscribe();
  }

  addDefinition() {
    // open editor with no id (new dashboard mode)
    this.router.navigate(['editor']);
  }

  removeDefinition() {
    const removedElement = this.elements.splice(this.selectedElementIndex, 1)[0];
    if (this.elements.length == 0) {
      // list is empty, let's go home
      this.router.navigate(['viewer']);
    }
    else {
      // navigate to next in line dashboard
      let index;
      if (this.selectedElementIndex == this.elements.length) {
        index = this.selectedElementIndex - 1;
      } else {
        index = this.selectedElementIndex;
      }
      this.router.navigate([`viewer/${this.elements[index].id}`]);
    }

    // remove from server
    this.definitionsProxy.deleteDefinition(removedElement.id).subscribe();
  }

  move(up: boolean) {
    const elementToMove = this.elements.splice(this.selectedElementIndex, 1)[0];
    elementToMove.position = up ? this.selectedElementIndex - 1 : this.selectedElementIndex + 1;
    this.elements.splice(elementToMove.position, 0, elementToMove);
    this.selectedElementIndex = elementToMove.position;

    // update in server
    this.elementsProxy.updateElement(elementToMove.id, elementToMove).subscribe();
  }

  showProperties() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = new PropertiesData(this.elements[this.selectedElementIndex].name);

    const dialogRef = this.dialog.open(PropertiesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data: PropertiesData) => {
      if (data != null) {
        // update name in list
        const element = this.elements[this.selectedElementIndex];
        element.name = data.name;

        // update active dashboard name (this also sets dirty flag, but that's OK at this time)
        this.activeDashboardService.name = data.name;

        // and update server
        this.elementsProxy.updateElement(element.id, element).subscribe();
      }
    });   
  }
}
