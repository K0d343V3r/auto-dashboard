import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { DefinitionsProxy, ElementsProxy, FolderElement, DefinitionElement, FoldersProxy, DashboardFolder } from '../proxies/dashboard-api';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActiveDashboardService } from '../services/active-dashboard/active-dashboard.service';
import { MatDialog, MatDialogConfig, MatTabGroup } from "@angular/material";
import { DashboardPropertiesComponent, DashboardPropertiesData } from '../properties/dashboard-properties/dashboard-properties.component';
import { FolderPropertiesData, FolderPropertiesComponent } from '../properties/folder-properties/folder-properties.component';
import { NavigationService } from '../services/navigation.service';
import { DahsboardElements } from '../services/elements-resolver.service';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
  private definitionChangedSubscription: Subscription;
  private folderChangedSubscription: Subscription;
  private elementsChangedSubscription: Subscription;

  private readonly foldersTabIndex: number = 0;
  private readonly dashboardsTabIndex: number = 1;
  @ViewChild("tabGroup") private tabGroup: MatTabGroup;

  elements: DahsboardElements = new DahsboardElements([]);
  selectedFolderIndex: number = -1;
  selectedDefinitionIndex: number = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private activeDashboardService: ActiveDashboardService,
    private definitionsProxy: DefinitionsProxy,
    private elementsProxy: ElementsProxy,
    private foldersProxy: FoldersProxy,
    private dialog: MatDialog,
    public navigationService: NavigationService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.elementsChangedSubscription = this.activatedRoute.data.subscribe(() => {
      this.elements = this.activatedRoute.snapshot.data.elements;
      this.onDefinitionChanged();
    });

    this.folderChangedSubscription = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      // select active folder
      this.selectedFolderIndex = this.elements.folders.findIndex(f => f.id === +params.get(NavigationService.folderParamName));

      if (params.get(NavigationService.tabParamName) === NavigationService.dashboardsTab) {
        this.tabGroup.selectedIndex = this.dashboardsTabIndex;
      } else {
        this.tabGroup.selectedIndex = this.foldersTabIndex;
      }
    });

    this.definitionChangedSubscription = this.activeDashboardService.definitionChanged$.subscribe(() => {
      this.onDefinitionChanged();
    });
  }

  ngAfterViewInit() {

  }

  ngAfterContentChecked() {
    // removes dev error because same disabled checks are used for both folders and definitions
    this.changeDetectionRef.detectChanges();
  }

  private onDefinitionChanged() {
    // select active dashboard
    if (this.activeDashboardService.id > 0) {
      this.selectedDefinitionIndex = this.elements.definitions.findIndex(d => d.id === this.activeDashboardService.id);
    } else {
      this.selectedDefinitionIndex = -1;
    }
  }

  ngOnDestroy() {
    this.definitionChangedSubscription.unsubscribe();
    this.folderChangedSubscription.unsubscribe();
    this.elementsChangedSubscription.unsubscribe();
  }

  addElement() {
    if (this.tabGroup.selectedIndex === this.dashboardsTabIndex) {
      // open editor with folder id (new dashboard mode)
      this.navigationService.createDashboard(this.elements.folders[this.selectedFolderIndex].id);
    } else {
      // add a new folder
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      const dialogRef = this.dialog.open(FolderPropertiesComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data: FolderPropertiesData) => {
        if (data != null) {
          const folder = new DashboardFolder();
          folder.name = data.name;
          folder.position = -1;
          this.foldersProxy.createFolder(folder).subscribe(folder2 => {
            // strange, but I have to add it to list before navigating...
            const element = new FolderElement();
            element.id = folder2.id;
            element.name = folder2.name;
            element.position = folder2.position;
            this.elements.folders.push(element);
            this.selectedFolderIndex = this.elements.folders.length - 1;
            this.navigationService.viewFolder(folder2.id, false);
          });
        }
      });
    }
  }

  onFolderClick(folder: FolderElement) {
    if (folder.defaultDefinitionId > 0) {
      this.navigationService.viewDashboard(folder.id, folder.defaultDefinitionId, false);
    } else {
      this.navigationService.viewFolder(folder.id, false);
    }
  }

  onDefinitionClick(definition: DefinitionElement) {
    const folderId = this.elements.folders[this.selectedFolderIndex].id;
    this.navigationService.viewDashboard(folderId, definition.id);
  }

  onTabChanged(index: number) {
    const folder = this.elements.folders[this.selectedFolderIndex];
    const definition = this.selectedDefinitionIndex >= 0 ? this.elements.definitions[this.selectedDefinitionIndex] : null;
    if (definition !== null) {
      this.navigationService.viewDashboard(folder.id, folder.defaultDefinitionId, index === this.dashboardsTabIndex, false);
    } else {
      this.navigationService.viewFolder(folder.id, index === this.dashboardsTabIndex, false);
    }
  }

  canRemove(): boolean {
    if (this.tabGroup.selectedIndex === this.foldersTabIndex) {
      return this.elements.folders.length > 1 && this.selectedFolderIndex >= 0;
    } else {
      return this.selectedDefinitionIndex >= 0;
    }
  }

  canMove(up: boolean): boolean {
    if (this.tabGroup.selectedIndex === this.foldersTabIndex) {
      return up ? this.selectedFolderIndex > 0 :
        this.selectedFolderIndex >= 0 && this.selectedFolderIndex < this.elements.folders.length - 1;
    } else {
      return up ? this.selectedDefinitionIndex > 0 :
        this.selectedDefinitionIndex >= 0 && this.selectedDefinitionIndex < this.elements.definitions.length - 1;
    }
  }

  canShowProperties(): boolean {
    if (this.tabGroup.selectedIndex === this.foldersTabIndex) {
      return this.elements.folders.length > 0;
    } else {
      return this.elements.definitions.length > 0;
    }
  }

  removeElement() {
    if (this.tabGroup.selectedIndex === this.foldersTabIndex) {
      // remove from list
      const removedFolder = this.elements.folders.splice(this.selectedFolderIndex, 1)[0];
      if (this.selectedFolderIndex === this.elements.folders.length) {
        this.selectedFolderIndex = this.selectedFolderIndex - 1;
      }

      // remove from server (must be done before navigation since it reloads all folders)
      this.foldersProxy.deleteFolder(removedFolder.id).subscribe(() => {
        // navigate to currently selected folder
        this.navigationService.viewFolder(this.elements.folders[this.selectedFolderIndex].id, false);
      });
    } else {
      // remove from list
      const removedDefinition = this.elements.definitions.splice(this.selectedDefinitionIndex, 1)[0];
      if (this.selectedDefinitionIndex === this.elements.definitions.length) {
        this.selectedDefinitionIndex = this.selectedDefinitionIndex - 1;
      }

      // remove from server (must be done before navigation since it reloads all folders)
      this.definitionsProxy.deleteDefinition(removedDefinition.id).subscribe(() => {
        if (this.elements.definitions.length > 0) {
          // navigate to currently selected definition
          this.navigationService.viewDashboard(
            this.elements.folders[this.selectedFolderIndex].id, this.elements.definitions[this.selectedDefinitionIndex].id);
        }
      });
    }
  }

  move(up: boolean) {
    if (this.tabGroup.selectedIndex === this.foldersTabIndex) {
      // update list
      const folderToMove = this.elements.folders.splice(this.selectedFolderIndex, 1)[0];
      folderToMove.position = up ? this.selectedFolderIndex - 1 : this.selectedFolderIndex + 1;
      this.elements.folders.splice(folderToMove.position, 0, folderToMove);
      this.selectedFolderIndex = folderToMove.position;

      // update server
      this.elementsProxy.updateFolderElement(folderToMove.id, folderToMove).subscribe();
    } else {
      // update list
      const definitionToMove = this.elements.definitions.splice(this.selectedDefinitionIndex, 1)[0];
      definitionToMove.position = up ? this.selectedDefinitionIndex - 1 : this.selectedDefinitionIndex + 1;
      this.elements.definitions.splice(definitionToMove.position, 0, definitionToMove);
      this.selectedDefinitionIndex = definitionToMove.position;

      // update server
      this.elementsProxy.updateDefinitionElement(definitionToMove.id, definitionToMove).subscribe();
    }
  }

  showProperties() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (this.tabGroup.selectedIndex === this.foldersTabIndex) {
      dialogConfig.data = new FolderPropertiesData(this.elements.folders[this.selectedFolderIndex].name);
      const dialogRef = this.dialog.open(FolderPropertiesComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data: FolderPropertiesData) => {
        if (data != null) {
          // update name in list
          const element = this.elements.folders[this.selectedFolderIndex];
          element.name = data.name;

          // and update server
          this.elementsProxy.updateFolderElement(element.id, element).subscribe();
        }
      });
    } else {
      dialogConfig.data = new DashboardPropertiesData(this.elements.definitions[this.selectedDefinitionIndex].name);
      const dialogRef = this.dialog.open(DashboardPropertiesComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data: DashboardPropertiesData) => {
        if (data != null) {
          // update name in list
          const element = this.elements.definitions[this.selectedDefinitionIndex];
          element.name = data.name;

          // update active dashboard name (this also sets dirty flag, but that's OK at this time)
          this.activeDashboardService.name = data.name;

          // and update server
          this.elementsProxy.updateDefinitionElement(element.id, element).subscribe();
        }
      });
    }
  }
}
