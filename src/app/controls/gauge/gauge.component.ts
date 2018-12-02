import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SimulatorTag } from 'src/app/proxies/data-simulator-api';
import { IDashboardControl } from '../common/i-dashboard-control';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit, AfterViewInit, IDashboardControl {
  private chartObj: Highcharts.ChartObject;

  @Input() tag: SimulatorTag;

  chart: Chart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: undefined
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Line 1',
        data: [1, 2, 3]
      }
    ]
  });

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.chart.ref$.subscribe(chartObj => {
      this.chartObj = chartObj;
      this.resize();
    });
  }

  resize() {
    setTimeout(() => {
      this.chartObj.reflow();
    }, 100);
  }
}
