import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { SimulatorItem, SimulatorTag, BooleanTag, NumericTag, StringTag, SimulatorDocument, DocumentDataProxy } from 'src/app/proxies/data-simulator-api';
import { ControlHostDirective } from './control-host.directive';
import { LedComponent } from '../led/led.component';
import { GaugeComponent } from '../gauge/gauge.component';
import { LabelComponent } from '../label/label.component';
import { IDashboardControl, ITagControl } from '../i-dashboard-control';
import { ActiveDashboardService } from 'src/app/services/active-dashboard/active-dashboard.service';
import { Subscription } from 'rxjs';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';
import { RequestType } from 'src/app/proxies/dashboard-api';
import { TrendComponent } from '../trend/trend.component';
import { DocumentComponent } from '../document/document.component';

@Component({
  selector: 'app-control-host',
  templateUrl: './control-host.component.html',
  styleUrls: ['./control-host.component.css']
})
export class ControlHostComponent implements OnInit, OnDestroy {
  @ViewChild(ControlHostDirective) private controlHost: ControlHostDirective;
  private control: IDashboardControl;
  private layoutChangedSubscription: Subscription;
  private dataChannelSubscription: Subscription;
  private requestTypeSubscription: Subscription;
  private lastRequestType: RequestType;

  @Input() item: SimulatorItem;

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

    this.dataChannelSubscription = this.dashboardDataService.openChannel(this.item).subscribe(values => {
      this.control.data = values;
    });

    this.requestTypeSubscription = this.activeDashboardService.requestTypeChanged$.subscribe(() => {
      this.switchHostedControl();
    })
  }

  ngOnDestroy() {
    this.layoutChangedSubscription.unsubscribe();
    this.dashboardDataService.closeChannel(this.item);
    this.dataChannelSubscription.unsubscribe();
    this.requestTypeSubscription.unsubscribe();
  }

  getContentWidth(): number {
    if (this.item instanceof SimulatorTag) {
      return (<ITagControl>this.control).getContentWidth();
    }
    return 0;
  }

  private createHostedControl() {
    // create hosted control factory
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.getControlType());

    // remove existing hosted control
    this.controlHost.viewContainerRef.clear();

    // create new hosted control
    const componentRef = this.controlHost.viewContainerRef.createComponent(factory);

    // initialize its inputs
    this.control = <IDashboardControl>componentRef.instance;
    this.control.item = this.item;

    // and save last request type to optimize control switching
    this.lastRequestType = this.activeDashboardService.requestType;
  }

  private switchHostedControl() {
    if (!(this.item instanceof SimulatorDocument) &&
      (this.lastRequestType !== RequestType.History && this.activeDashboardService.requestType === RequestType.History) ||
      (this.lastRequestType === RequestType.History && this.activeDashboardService.requestType !== RequestType.History)) {
      // this is not a static document, and we have switched from single to multi value display (or viceversa)
      this.createHostedControl();
    }
  }

  private getControlType(): Type<any> {
    if (this.item instanceof SimulatorDocument) {
      return DocumentComponent;
    } else if (this.activeDashboardService.requestType === RequestType.History) {
      // all tags render as trend charts
      return TrendComponent;
    } else if (this.item instanceof BooleanTag) {
      return LedComponent;
    } else if (this.item instanceof NumericTag) {
      return GaugeComponent;
    } else if (this.item instanceof StringTag) {
      return LabelComponent;
    }
  }
}