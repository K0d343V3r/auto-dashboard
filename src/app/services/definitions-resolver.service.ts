import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DashboardDefinition, DefinitionsProxy } from '../proxies/dashboard-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DefinitionsResolverService implements Resolve<DashboardDefinition[]> {

  constructor(
    private definitionsProxy: DefinitionsProxy
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<DashboardDefinition[]> {
    return this.definitionsProxy.getAllDefinitions();
  }
}
