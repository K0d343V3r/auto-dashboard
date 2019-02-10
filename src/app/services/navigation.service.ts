import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  static readonly viewerPath = "viewer";
  static readonly outletName = "sidenav";
  static readonly editorPath = "editor";
  static readonly kioskPath = "kiosk";
  static readonly editorFolderPath = "folder";
  static readonly definitionParamName = "definitionId";
  static readonly folderParamName = "folderId";
  static readonly tabParamName = "tab";
  static readonly dashboardsTab = "dashboards";
  static readonly foldersTab = "folders";

  constructor(
    private router: Router, 
    private location: Location,
    @Inject(DOCUMENT) private document: any
    ) { }

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

  kioskDashboard(definitionId: number, replaceUrl: boolean = false) {
    this.router.navigateByUrl(`${NavigationService.kioskPath}/${definitionId}`, { replaceUrl: replaceUrl });
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

  openFullscreen() {
    if (this.document.documentElement.requestFullscreen) {
      this.document.documentElement.requestFullscreen();
    } else if (this.document.documentElement.mozRequestFullScreen) {    /* Firefox */
      this.document.documentElement.mozRequestFullScreen();
    } else if (this.document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      this.document.documentElement.webkitRequestFullscreen();
    } else if (this.document.documentElement.msRequestFullscreen) {     /* IE/Edge */
      this.document.documentElement.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {   /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {  /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }
}
