import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BrowserComponent } from '../browser/browser.component';
import { ConfiguratorComponent } from '../configurator/configurator.component';

const routes: Routes = [
  {
    path: 'viewer',
    component: WorkspaceComponent,
    children: [
      {
        path: ':id',
        component: DashboardComponent
      }, {
        path: ':id',
        component: BrowserComponent,
        outlet: 'sidenav'
      }, {
        path: '',
        component: BrowserComponent,
        outlet: 'sidenav'
      }
    ]
  }, {
    path: 'editor',
    component: WorkspaceComponent,
    children: [
      {
        path: ':id',
        component: DashboardComponent
      }, {
        path: '',
        component: DashboardComponent
      }, {
        path: ':id',
        component: ConfiguratorComponent,
        outlet: 'sidenav'
      }, {
        path: '',
        component: ConfiguratorComponent,
        outlet: 'sidenav'
      }
    ]
  }, {
    path: 'dashboard/:id',
    component: DashboardComponent
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
  exports: [RouterModule]
})
export class AppRoutingModule { }
