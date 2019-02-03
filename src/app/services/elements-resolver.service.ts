import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ElementsProxy, FolderElement, FoldersProxy, DashboardFolder, DefinitionElement } from '../proxies/dashboard-api';
import { Observable, EMPTY, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NavigationService } from './navigation.service';

export class DahsboardElements {
  constructor(public folders: FolderElement[], public definitions: DefinitionElement[] = []) { }
}

@Injectable({
  providedIn: 'root',
})
export class ElementsResolverService implements Resolve<DahsboardElements> {
  constructor(
    private elementsProxy: ElementsProxy,
    private foldersProxy: FoldersProxy,
    private router: Router,
    private navigationService: NavigationService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DahsboardElements> | Observable<never> {
    return this.elementsProxy.getAllFolderElements().pipe(
      mergeMap(folders => {
        if (folders.length === 0) {
          // default folder does not exist, create it
          const folder = new DashboardFolder();
          folder.name = "My Dashboards";
          return this.foldersProxy.createFolder(folder).pipe(
            mergeMap(folder => {
              const element = new FolderElement();
              element.defaultDefinitionId = 0;
              element.id = folder.id;
              element.name = folder.name;
              element.position = folder.position;

             // navigate to default folder
             this.navigationService.viewFolder(folder.id);
             return EMPTY;
            }),
            catchError(() => {
              // on error, go back to original location
              this.navigationService.goTo(this.router.url);
              return EMPTY;
            })
          );
        } else if (route.params[NavigationService.folderParamName] != null) {
          // a folder was specified, load its definitions
          return this.elementsProxy.getAllDefinitionElements(+route.params[NavigationService.folderParamName]).pipe(
            mergeMap(definitions => {
              return of(new DahsboardElements(folders, definitions));
            }),
            catchError(() => {
              // on error, go back to original location
              this.navigationService.goTo(this.router.url);
              return EMPTY;
            })
          );
        } else if (folders[0].defaultDefinitionId > 0) {
          // no folder specified and we have a default dashboard, route to it
          this.navigationService.viewDashboard(folders[0].id, folders[0].defaultDefinitionId);
          return EMPTY;
        } else {
          // no default dashboard (empty folder), just route to folder
          this.navigationService.viewFolder(folders[0].id);
        }
      }),
      catchError(() => {
        // on error, go back to original location
        this.navigationService.goTo(this.router.url);
        return EMPTY;
      })
    );
  }
}
