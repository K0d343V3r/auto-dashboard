import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
export class BrowserComponent implements OnInit, OnDestroy {
  private definitionChangedSubscription: Subscription;
  private folderChangedSubscription: Subscription;
  private elementsChangedSubscription;

  private readonly foldersTabIndex: number = 0;
  private readonly definitionsTabIndex: number = 1;
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
    public navigationService: NavigationService
  ) {
  }

  ngOnInit() {
    this.elementsChangedSubscription = this.activatedRoute.data.subscribe(() => {
      this.elements = null;
      this.elements = this.activatedRoute.snapshot.data.elements;
    });

    this.folderChangedSubscription = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      // select active folder
      this.selectedFolderIndex = this.elements.folders.findIndex(f => f.id === +params.get(NavigationService.folderParamName));

      // and show its dashboards
      this.tabGroup.selectedIndex = this.definitionsTabIndex;
    });

    this.onDefinitionChanged();
    this.definitionChangedSubscription = this.activeDashboardService.definitionChanged$.subscribe(() => {
      this.onDefinitionChanged();
    });
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
    if (this.tabGroup.selectedIndex === this.definitionsTabIndex) {
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
            this.navigationService.viewFolder(folder2.id);
          });
        }
      });
    }
  }

  onFolderClick(folder: FolderElement) {
    if (folder.defaultDefinitionId > 0) {
      return this.navigationService.viewDashboard(folder.id, folder.defaultDefinitionId);
    } else {
      return this.navigationService.viewFolder(folder.id);
    }
  }

  removeDefinition() {
    this.navigationService.viewFolder(2);
    // const removedElement = this.folders.splice(this.selectedFolderIndex, 1)[0];
    // if (this.folders.length == 0) {
    //   // list is empty, let's go home
    //   this.router.navigate(['viewer']);
    // }
    // else {
    //   // navigate to next in line dashboard
    //   let index;
    //   if (this.selectedFolderIndex == this.folders.length) {
    //     index = this.selectedFolderIndex - 1;
    //   } else {
    //     index = this.selectedFolderIndex;
    //   }
    //   this.router.navigate([`viewer/${this.folders[index].id}`]);
    // }

    // // remove from server
    // this.definitionsProxy.deleteDefinition(removedElement.id).subscribe();
  }

  move(up: boolean) {
    // const elementToMove = this.folders.splice(this.selectedFolderIndex, 1)[0];
    // elementToMove.position = up ? this.selectedFolderIndex - 1 : this.selectedFolderIndex + 1;
    // this.folders.splice(elementToMove.position, 0, elementToMove);
    // this.selectedFolderIndex = elementToMove.position;

    // update in server
    // this.elementsProxy.updateElement(elementToMove.id, elementToMove).subscribe();
  }

  showProperties() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = new DashboardPropertiesData(this.folders[this.selectedFolderIndex].name);

    // const dialogRef = this.dialog.open(DashboardPropertiesComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((data: DashboardPropertiesData) => {
    //   if (data != null) {
    //     // update name in list
    //     const element = this.folders[this.selectedFolderIndex];
    //     element.name = data.name;

    //     // update active dashboard name (this also sets dirty flag, but that's OK at this time)
    //     this.activeDashboardService.name = data.name;

    //     // and update server
    //     // this.elementsProxy.updateElement(element.id, element).subscribe();
    //   }
    // });
  }
}
