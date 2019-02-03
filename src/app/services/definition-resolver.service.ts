import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DashboardDefinition, DefinitionsProxy } from '../proxies/dashboard-api';
import { Observable, EMPTY, of } from 'rxjs';
import { ActiveDashboardService } from './active-dashboard/active-dashboard.service';
import { mergeMap, catchError } from 'rxjs/operators';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { NavigationService } from './navigation.service';

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
    if (route.params[NavigationService.definitionParamName] == null) {
      // no definition specified, reset active dashboard
      if (route.params[NavigationService.folderParamName] == null) {
        this.activeDashboardService.reset();
      } else {
        // a folder was spefied, seed active dashboard with it
        this.activeDashboardService.reset(+route.params[NavigationService.folderParamName]);
      }
      return of(null);
    } else {
      // definition specified, load it
      return this.definitionsProxy.getDefinition(+route.params[NavigationService.definitionParamName]).pipe(
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
