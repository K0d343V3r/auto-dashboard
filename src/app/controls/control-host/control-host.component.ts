import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, Type, OnDestroy, AfterViewInit } from '@angular/core';
import { SimulatorItem, SimulatorTag, BooleanTag, NumericTag, StringTag, SimulatorDocument } from 'src/app/proxies/data-simulator-api';
import { ControlHostDirective } from './control-host.directive';
import { LedComponent } from '../led/led.component';
import { GaugeComponent } from '../gauge/gauge.component';
import { LabelComponent } from '../label/label.component';
import { IDashboardControl } from '../i-dashboard-control';
import { ActiveDashboardService } from 'src/app/services/active-dashboard.service';
import { Subscription } from 'rxjs';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';
import { RequestType } from 'src/app/proxies/dashboard-api';
import { TrendComponent } from '../trend/trend.component';

@Component({
  selector: 'app-control-host',
  templateUrl: './control-host.component.html',
  styleUrls: ['./control-host.component.css']
})
export class ControlHostComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ControlHostDirective) private controlHost: ControlHostDirective;
  private control: IDashboardControl;
  private layoutChangedSubscription: Subscription;
  private dataChannelSubscription: Subscription;
  private requestTypeSubscription: Subscription;

  @Input() tag: SimulatorItem;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private activeDashboardService: ActiveDashboardService,
    private dashboardDataService: DashboardDataService
  ) { }

  ngOnInit() {
    this.createHostedControl()

    this.layoutChangedSubscription = this.activeDashboardService.layoutChanged$.subscribe(() => {
      this.control.resize();
    });

    if (this.tag instanceof SimulatorTag) {
      this.dataChannelSubscription = this.dashboardDataService.openChannel(this.tag.id).subscribe(values => {
        this.control.data = values;
      });
    }

    this.requestTypeSubscription = this.activeDashboardService.requestTypeChanged$.subscribe(() => {
      this.createHostedControl();
    })
  }

  ngOnDestroy() {
    this.layoutChangedSubscription.unsubscribe();
    if (this.tag instanceof SimulatorTag) {
      this.dashboardDataService.closeChannel(this.tag.id);
      this.dataChannelSubscription.unsubscribe();
    }
    this.requestTypeSubscription.unsubscribe();
  }

  ngAfterViewInit() {

  }

  getContentWidth(): number {
    return this.control.getContentWidth();
  }

  private createHostedControl() {
    // create hosted control factory
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.getControlType());

    // remove existing hosted control
    this.controlHost.viewContainerRef.clear();

    // create new hosted control
    const componentRef = this.controlHost.viewContainerRef.createComponent(factory);

    // and initialize its inputs
    this.control = <IDashboardControl>componentRef.instance;
    this.control.tag = this.tag;
  }

  private getControlType(): Type<any> {
    if (this.tag instanceof SimulatorDocument) {
      // TODO
    } else if (this.activeDashboardService.requestType === RequestType.History) {
      // all tags render as trend charts
      return TrendComponent;
    } else if (this.tag instanceof BooleanTag) {
      return LedComponent;
    } else if (this.tag instanceof NumericTag) {
      return GaugeComponent;
    } else if (this.tag instanceof StringTag) {
      return LabelComponent;
    }
  }
}
