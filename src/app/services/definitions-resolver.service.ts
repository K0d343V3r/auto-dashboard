import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DashboardDefinition, DefinitionsProxy } from '../proxies/dashboard-api';
import { Observable, EMPTY, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DefinitionsResolverService implements Resolve<DashboardDefinition[]> {

  constructor(
    private definitionsProxy: DefinitionsProxy,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DashboardDefinition[]> | Observable<never> {
    return this.definitionsProxy.getAllDefinitions().pipe(
      mergeMap(definitions => {
        return of(definitions);
      }),
      catchError(() => {
        // on error, go back to original location
        this.router.navigate([this.router.url]);
        return EMPTY;
      })
    );
  }
}
