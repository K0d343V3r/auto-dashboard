import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, Type, OnDestroy, AfterViewInit } from '@angular/core';
import { SimulatorTag, TagType } from 'src/app/proxies/data-simulator-api';
import { ControlHostDirective } from './control-host.directive';
import { LedComponent } from '../led/led.component';
import { GaugeComponent } from '../gauge/gauge.component';
import { LabelComponent } from '../label/label.component';
import { IDashboardControl } from './i-dashboard-control';
import { ActiveDashboardService } from 'src/app/services/active-dashboard.service';
import { Subscription } from 'rxjs';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';

@Component({
  selector: 'app-dashboard-control',
  templateUrl: './dashboard-control.component.html',
  styleUrls: ['./dashboard-control.component.css']
})
export class DashboardControlComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ControlHostDirective) private controlHost: ControlHostDirective;
  private control: IDashboardControl;
  private layoutChangedSubscription: Subscription;
  private dataChannelSubscription: Subscription;

  @Input() tag: SimulatorTag;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private activeDashboardService: ActiveDashboardService,
    private dashboardDataService: DashboardDataService
  ) { }

  ngOnInit() {
    const controlType = this.getControlType();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(controlType);

    const viewContainerRef = this.controlHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.control = <IDashboardControl>componentRef.instance;
    this.control.tag = this.tag;

    this.layoutChangedSubscription = this.activeDashboardService.layoutChanged$.subscribe(() => {
      this.control.resize();
    });

    this.dataChannelSubscription = this.dashboardDataService.openChannel(this.tag.id).subscribe(values => {
      this.control.values = values;
    });
  }

  ngOnDestroy() {
    this.layoutChangedSubscription.unsubscribe();
    this.dashboardDataService.closeChannel(this.tag.id);
    this.dataChannelSubscription.unsubscribe();
  }

  ngAfterViewInit() {

  }

  private getControlType(): Type<any> {
    switch (this.tag.type) {
      case TagType.Boolean:
        return LedComponent;

      case TagType.Number:
        return GaugeComponent;

      case TagType.String:
        return LabelComponent;
    }
  }
}
