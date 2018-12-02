import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, Type } from '@angular/core';
import { SimulatorTag, TagType } from 'src/app/proxies/data-simulator-api';
import { ControlHostDirective } from './control-host.directive';
import { LedComponent } from '../led/led.component';
import { GaugeComponent } from '../gauge/gauge.component';
import { LabelComponent } from '../label/label.component';
import { IDashboardControl } from './i-dashboard-control';

@Component({
  selector: 'app-control-loader',
  templateUrl: './control-loader.component.html',
  styleUrls: ['./control-loader.component.css']
})
export class ControlLoaderComponent implements OnInit {
  @Input() tag: SimulatorTag;
  @ViewChild(ControlHostDirective) controlHost: ControlHostDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    const controlType = this.getControlType();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(controlType);

    const viewContainerRef = this.controlHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<IDashboardControl>componentRef.instance).tag = this.tag;
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
