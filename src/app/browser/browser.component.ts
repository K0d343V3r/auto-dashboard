import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DefinitionsProxy, ElementsProxy, FolderElement, DefinitionElement } from '../proxies/dashboard-api';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ActiveDashboardService } from '../services/active-dashboard/active-dashboard.service';
import { MatDialog, MatDialogConfig, MatTabGroup } from "@angular/material";
import { PropertiesComponent, PropertiesData } from '../properties/properties.component';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit, OnDestroy {
  private definitionChangedSubscription: Subscription;
  private readonly foldersTabIndex: number = 0;
  private readonly definitionsTabIndex: number = 1;

  @ViewChild("tabGroup") private tabGroup: MatTabGroup;

  folders: FolderElement[] = [];
  definitions$: Observable<DefinitionElement[]>;
  selectedFolderIndex: number = -1;
  selectedDefinitionIndex: number = -1;

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
    // initialize with resolved folders
    this.folders = this.activatedRoute.snapshot.data.elements;
    this.onDefinitionChanged();

    this.definitionChangedSubscription = this.activeDashboardService.definitionChanged$.subscribe(() => {
      this.onDefinitionChanged();
    });
  }

  private onDefinitionChanged() {
    if (this.activeDashboardService.id === 0) {
      // no active dashboard, select first folder
      this.selectedFolderIndex = 0;
    } else {
      // we have an active dashboard, select its folder
      this.selectedFolderIndex = this.folders.findIndex(d => d.id == this.activeDashboardService.dashboardFolderId);

      // and load folder's dashboards
      this.definitions$ = this.elementsProxy.getAllDefinitionElements(this.activeDashboardService.dashboardFolderId);
    }

    // and activate it
    this.tabGroup.selectedIndex = this.definitionsTabIndex;
  }

  ngOnDestroy() {
    this.definitionChangedSubscription.unsubscribe();
  }

  addElement() {
    // open editor with no id (new dashboard mode)
    this.router.navigate([`editor/new/${this.folders[this.selectedFolderIndex].id}`]);
  }

  removeDefinition() {
    const removedElement = this.folders.splice(this.selectedFolderIndex, 1)[0];
    if (this.folders.length == 0) {
      // list is empty, let's go home
      this.router.navigate(['viewer']);
    }
    else {
      // navigate to next in line dashboard
      let index;
      if (this.selectedFolderIndex == this.folders.length) {
        index = this.selectedFolderIndex - 1;
      } else {
        index = this.selectedFolderIndex;
      }
      this.router.navigate([`viewer/${this.folders[index].id}`]);
    }

    // remove from server
    this.definitionsProxy.deleteDefinition(removedElement.id).subscribe();
  }

  move(up: boolean) {
    const elementToMove = this.folders.splice(this.selectedFolderIndex, 1)[0];
    elementToMove.position = up ? this.selectedFolderIndex - 1 : this.selectedFolderIndex + 1;
    this.folders.splice(elementToMove.position, 0, elementToMove);
    this.selectedFolderIndex = elementToMove.position;

    // update in server
    // this.elementsProxy.updateElement(elementToMove.id, elementToMove).subscribe();
  }

  showProperties() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = new PropertiesData(this.folders[this.selectedFolderIndex].name);

    const dialogRef = this.dialog.open(PropertiesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data: PropertiesData) => {
      if (data != null) {
        // update name in list
        const element = this.folders[this.selectedFolderIndex];
        element.name = data.name;

        // update active dashboard name (this also sets dirty flag, but that's OK at this time)
        this.activeDashboardService.name = data.name;

        // and update server
        // this.elementsProxy.updateElement(element.id, element).subscribe();
      }
    });
  }
}
