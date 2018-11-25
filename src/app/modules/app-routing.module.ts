import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BrowserComponent } from '../browser/browser.component';
import { ConfiguratorComponent } from '../configurator/configurator.component';
import { DefinitionsResolverService } from '../services/definitions-resolver.service';
import { DefinitionResolverService } from '../services/definition-resolver.service';
import { OverviewComponent } from '../overview/overview.component';

const routes: Routes = [
  {
    path: 'viewer',
    component: WorkspaceComponent,
    children: [
      {
        path: ':id',
        component: DashboardComponent,
        resolve: {
          definition: DefinitionResolverService
        }
      }, {
        path: '',
        component: OverviewComponent,
        resolve: {
          definition: DefinitionResolverService
        }
      }, {
        path: '',
        component: BrowserComponent,
        outlet: 'sidenav',
        resolve: {
          definitions: DefinitionsResolverService
        }
      }
    ]
  }, {
    path: 'editor',
    component: WorkspaceComponent,
    children: [
      {
        path: ':id',
        component: DashboardComponent,
        resolve: {
          definition: DefinitionResolverService
        }
      }, {
        path: '',
        component: DashboardComponent,
        resolve: {
          definition: DefinitionResolverService
        }
      }, {
        path: '',
        component: ConfiguratorComponent,
        outlet: 'sidenav'
      }
    ]
  }, {
    path: 'dashboard/:id',
    component: DashboardComponent,
    resolve: {
      definition: DefinitionResolverService
    }
  }, {
    path: '',
    redirectTo: 'viewer',
    pathMatch: 'full'
  }, {
    path: '**',
    redirectTo: 'viewer',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [DefinitionsResolverService, DefinitionResolverService]
})
export class AppRoutingModule { }
