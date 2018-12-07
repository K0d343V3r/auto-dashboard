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
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as More from 'highcharts/highcharts-more.src';
import * as SolidGauge from 'highcharts/modules/solid-gauge.src';
import { GaugeComponent } from './controls/gauge/gauge.component';
import { LedComponent } from './controls/led/led.component';
import { LabelComponent } from './controls/label/label.component';
import { ControlHostDirective } from './controls/control-host/control-host.directive';
import { ControlHostComponent } from './controls/control-host/control-host.component';
import { DataSettingsComponent } from './configurator/data-settings/data-settings.component';
import { TimeSettingsComponent } from './configurator/time-settings/time-settings.component';
import { TrendComponent } from './controls/trend/trend.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfiguratorComponent,
    WorkspaceComponent,
    BrowserComponent,
    DashboardComponent,
    OverviewComponent,
    PropertiesComponent,
    GaugeComponent,
    LedComponent,
    LabelComponent,
    ControlHostDirective,
    ControlHostComponent,
    DataSettingsComponent,
    TimeSettingsComponent,
    TrendComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    ChartModule
  ],
  providers: [
    {
      provide: API_BASE_URL_DASHBOARD, useValue: 'https://localhost:44340'
    }, {
      provide: API_BASE_URL_SIMULATOR, useValue: 'https://localhost:44364'
    }, {
      provide: HIGHCHARTS_MODULES, useFactory: () => [ More, SolidGauge ]
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [PropertiesComponent, GaugeComponent, LedComponent, LabelComponent, TrendComponent]
})
export class AppModule { }
