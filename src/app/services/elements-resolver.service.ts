import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ElementsProxy, FolderElement, FoldersProxy, DashboardFolder } from '../proxies/dashboard-api';
import { Observable, EMPTY, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { SwaggerException } from '../proxies/data-simulator-api';

@Injectable({
  providedIn: 'root',
})
export class ElementsResolverService implements Resolve<FolderElement[]> {
  private readonly defaultFolderId = 1;

  constructor(
    private elementsProxy: ElementsProxy,
    private foldersProxy: FoldersProxy,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FolderElement[]> | Observable<never> {
    if (state.url.split('/').length > 2) {
      // we specified a dashboard, just return all folders
      return this.elementsProxy.getAllFolderElements();
    } else {
      // no dashboard specified, route to default dashboard for default folder
      return this.elementsProxy.getFolderElement(this.defaultFolderId).pipe(
        mergeMap(element => {
          if (element.defaultDefinitionId === 0) {
            // default folder is empty, nothing to re-route to
            return of([element]);
          } else {
            // re-route to default folder's default dashboard
            this.router.navigate([`viewer/${element.defaultDefinitionId}`]);
            return EMPTY;
          }
        }),
        catchError((e: SwaggerException) => {
          if (e.status !== 404) {
            // on error, go back to original location
            this.router.navigate([this.router.url]);
            return EMPTY;
          } else {
            // default folder does not exist, create it
            const folder = new DashboardFolder();
            folder.name = "My Dashboards";
            return this.foldersProxy.createFolder(folder).pipe(
              mergeMap(folder => {
                // convert to local element
                const element = new FolderElement();
                element.defaultDefinitionId = 0;
                element.id = folder.id;
                element.name = folder.name;
                element.position = folder.position;

                // and return it
                return of([element]);
              }),
              catchError(() => {
                // on error, go back to original location
                this.router.navigate([this.router.url]);
                return EMPTY;
              })
            );
          }
        })
      );
    }
  }
}
