import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DashboardElement, ElementsProxy } from '../proxies/dashboard-api';
import { Observable, EMPTY, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ElementsResolverService implements Resolve<DashboardElement[]> {

  constructor(
    private elementsProxy: ElementsProxy,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DashboardElement[]> | Observable<never> {
    return this.elementsProxy.getAllElements().pipe(
      mergeMap(elements => {
        if (state.url.split('/').length > 2 || elements.length === 0) {
          // we are routing to a specific dashboard or we have no definitions, keep going
          return of(elements);
        } else {
          // we are routing to root viewer and we have definitions, redirect to first definition
          this.router.navigate([`viewer/${elements[0].id}`]);
          return EMPTY;
        }
      }),
      catchError(() => {
        // on error, go back to original location
        this.router.navigate([this.router.url]);
        return EMPTY;
      })
    );
  }
}
