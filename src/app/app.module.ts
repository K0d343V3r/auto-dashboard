import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "./modules/material.module";
import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { BrowserComponent } from './browser/browser.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { API_BASE_URL_DASHBOARD } from './proxies/dashboard-api';
import { API_BASE_URL_SIMULATOR } from './proxies/data-simulator-api';
import { HttpClientModule } from '@angular/common/http';
import { OverviewComponent } from './overview/overview.component';
import { PropertiesComponent } from './properties/properties.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    ConfiguratorComponent,
    WorkspaceComponent,
    BrowserComponent,
    DashboardComponent,
    OverviewComponent,
    PropertiesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    {
      provide: API_BASE_URL_DASHBOARD, useValue: 'https://localhost:44340'
    }, {
      provide: API_BASE_URL_SIMULATOR, useValue: 'https://localhost:44364'
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [PropertiesComponent]
})
export class AppModule { }
