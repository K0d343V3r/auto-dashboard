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

  viewDashboard(folderId: number, definitionId: number) {
    this.router.navigateByUrl(`${NavigationService.viewerPath}/(${definitionId}//${NavigationService.outletName}:${folderId})`);
  }

  viewFolder(folderId: number) {
    this.router.navigateByUrl(`${NavigationService.viewerPath}/(${NavigationService.outletName}:${folderId})`);  
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
