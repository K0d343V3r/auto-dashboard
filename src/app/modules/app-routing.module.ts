import { NgModule } from '@angular/core';
import { ElementsResolverService } from '../services/elements-resolver.service';
import { DefinitionResolverService } from '../services/definition-resolver.service';
import { RouterModule, Routes } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BrowserComponent } from '../browser/browser.component';
import { ConfiguratorComponent } from '../configurator/configurator.component';
import { OverviewComponent } from '../overview/overview.component';

const routes: Routes = [
  {
    path: NavigationService.viewerPath,
    component: WorkspaceComponent,
    children: [
      {
        path: `:${NavigationService.definitionParamName}`,
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
        path: `:${NavigationService.folderParamName}`,
        component: BrowserComponent,
        outlet: NavigationService.outletName,
        resolve: {
          elements: ElementsResolverService
        }
      }, {
        path: '',
        component: BrowserComponent,
        outlet: NavigationService.outletName,
        resolve: {
          elements: ElementsResolverService
        }
      }
    ]
  }, {
    path: NavigationService.editorPath,
    component: WorkspaceComponent,
    children: [
      {
        path: `:${NavigationService.definitionParamName}`,
        component: DashboardComponent,
        resolve: {
          definition: DefinitionResolverService
        }
      }, {
        path: `${NavigationService.editorFolderPath}/:${NavigationService.folderParamName}`,
        component: DashboardComponent,
        resolve: {
          definition: DefinitionResolverService
        }
      }, {
        path: '',
        component: ConfiguratorComponent,
        outlet: NavigationService.outletName
      }
    ]
  }, {
    path: '',
    redirectTo: NavigationService.viewerPath,
    pathMatch: 'full'
  }, {
    path: '**',
    redirectTo: NavigationService.viewerPath,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [ElementsResolverService, DefinitionResolverService]
})
export class AppRoutingModule { }
