import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { SimulatorTag, TagType } from 'src/app/proxies/data-simulator-api';
import { ControlHostDirective } from './control-host.directive';
import { LedComponent } from '../led/led.component';
import { GaugeComponent } from '../gauge/gauge.component';
import { LabelComponent } from '../label/label.component';
import { IDashboardControl } from './i-dashboard-control';
import { ActiveDashboardService } from 'src/app/services/active-dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-control',
  templateUrl: './dashboard-control.component.html',
  styleUrls: ['./dashboard-control.component.css']
})
export class DashboardControlComponent implements OnInit, OnDestroy {
  @ViewChild(ControlHostDirective) private controlHost: ControlHostDirective;
  private control: IDashboardControl;
  private layoutChangedSubscription: Subscription;

  @Input() tag: SimulatorTag;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private activeDashboardService: ActiveDashboardService
  ) { }

  ngOnInit() {
    const controlType = this.getControlType();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(controlType);

    const viewContainerRef = this.controlHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.control = <IDashboardControl>componentRef.instance;
    this.control.tag = this.tag;

    this.layoutChangedSubscription = this.activeDashboardService.tileLayoutChanged$.subscribe(() => {
      this.control.resize();
    });
  }

  ngOnDestroy() {
    this.layoutChangedSubscription.unsubscribe();
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
