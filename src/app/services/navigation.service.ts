import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  static readonly viewerPath = "viewer";
  static readonly outletName = "sidenav";
  static readonly editorPath = "editor";
  static readonly editorFolderPath = "folder";
  static readonly definitionParamName = "definitionId";
  static readonly folderParamName = "folderId";
  static readonly tabParamName = "tab";
  static readonly dashboardsTab = "dashboards";
  static readonly foldersTab = "folders";

  constructor(private router: Router, private location: Location) { }

  goTo(url: string) {
    this.router.navigateByUrl(url);
  }

  goHome() {
    this.router.navigateByUrl(NavigationService.viewerPath);
  }

  goBack() {
    this.location.back();
  }

  viewDashboard(folderId: number, definitionId: number, dashboardsTab: boolean = true, navigate: boolean = true, replaceUrl: boolean = false) {
    const url = `${NavigationService.viewerPath}/(${definitionId}//${NavigationService.outletName}:${folderId};${NavigationService.tabParamName}=${dashboardsTab ? NavigationService.dashboardsTab : NavigationService.foldersTab})`;
    if (navigate) {
      this.router.navigateByUrl(url, { replaceUrl: replaceUrl });
    } else {
      this.location.replaceState(url);
    }
  }

  viewFolder(folderId: number, dashboardsTab: boolean = true, navigate: boolean = true, replaceUrl: boolean = false) {
    const url = `${NavigationService.viewerPath}/(${NavigationService.outletName}:${folderId};${NavigationService.tabParamName}=${dashboardsTab ? NavigationService.dashboardsTab : NavigationService.foldersTab})`;
    if (navigate) {
      this.router.navigateByUrl(url, { replaceUrl: replaceUrl });
    } else {
      this.location.replaceState(url);
    }
  }

  editDashboard(definitionId: number) {
    this.router.navigateByUrl(`${NavigationService.editorPath}/${definitionId}`);
  }

  createDashboard(folderId: number) {
    this.router.navigateByUrl(`${NavigationService.editorPath}/${NavigationService.editorFolderPath}/${folderId}`);
  }

  getDefinitionLink(definitionId: number): string {
    return `/${NavigationService.viewerPath}/${definitionId}`;
  }
}
