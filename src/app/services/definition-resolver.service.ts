import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DashboardDefinition, DefinitionsProxy } from '../proxies/dashboard-api';
import { Observable, EMPTY, of } from 'rxjs';
import { ActiveDashboardService } from './active-dashboard/active-dashboard.service';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DefinitionResolverService implements Resolve<DashboardDefinition>  {

  constructor(
    private definitionsProxy: DefinitionsProxy,
    private activeDashboardService: ActiveDashboardService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DashboardDefinition> | Observable<never> {
    if (route.params.id == null) {
      this.activeDashboardService.reset();
      return of(null);
    } else {
      return this.definitionsProxy.getDefinition(+route.params.id).pipe(
        mergeMap(definition => {
          this.activeDashboardService.load(definition);
          return of(null);
        }),
        catchError(() => {
          // on error, go back to original location
          this.router.navigate([this.router.url]);
          return EMPTY;
        })
      );
    }
  }
}
