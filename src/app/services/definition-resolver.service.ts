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
    const parts = state.url.split('/');
    if (parts.length === 2) {
      // no dashboard specified (/viewer or /editor), reset
      this.activeDashboardService.reset();
      return of(null);
    } else if (parts.length === 4) {
      // new dashboard specified (/editor/new/{folder id})
      this.activeDashboardService.reset(+route.params.id);
    } else {
      // definition specified (/viewer/{definition id} or /editor/{defitinion id})
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
