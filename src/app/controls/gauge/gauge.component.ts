import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { SimulatorTag } from 'src/app/proxies/data-simulator-api';
import { IDashboardControl } from '../common/i-dashboard-control';
import { Chart, Highcharts } from 'angular-highcharts';
import { Subscription } from 'rxjs';
//require('highcharts/themes/grid-light')(Highcharts);  // not theming right now

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit, OnDestroy, AfterViewInit, IDashboardControl {
  private chartObj: Highcharts.ChartObject;
  private chartObjSubscription: Subscription;

  @Input() tag: SimulatorTag;
  chart: Chart;

  constructor() { }

  ngOnInit() {
    this.chart = new Chart(<any>{
      chart: {
        type: 'solidgauge'
      },

      title: null,

      pane: {
        center: ['50%', '66%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },

      tooltip: {
        enabled: false
      },

      yAxis: {
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353']  // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          text: null
        },
        labels: {
          y: 16
        },
        min: this.tag.scale.min,
        max: this.tag.scale.max
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      },

      credits: {
        enabled: false
      },

      series: [{
        name: this.tag.name,
        data: [160],
        dataLabels: {
          crop: false,
          overflow: 'allow',
          format:
            `<div style = "text-align: center; vertical-align: bottom; color: '${(Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'}'">
               <span style = "font-size: 25px">{y}</span>
               <span style = "font-size: 12px">${this.tag.engineeringUnits == null ? "" : "&nbsp" + this.tag.engineeringUnits}</span>
             </div>`
        }
      }]
    });
  }

  ngOnDestroy() {
    this.chartObjSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.chartObjSubscription = this.chart.ref$.subscribe(chartObj => {
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
