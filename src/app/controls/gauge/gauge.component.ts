import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { SimulatorTag } from 'src/app/proxies/data-simulator-api';
import { IDashboardControl } from '../i-dashboard-control';
import { Chart, Highcharts } from 'angular-highcharts';
import { TagData } from 'src/app/services/dashboard-data.service';
//require('highcharts/themes/grid-light')(Highcharts);  // not theming right now

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit, OnDestroy, AfterViewInit, IDashboardControl {
  private internalChart: Highcharts.ChartObject;

  @Input() tag: SimulatorTag;
  chart: Chart;

  constructor() { }

  ngOnInit() {
    this.chart = new Chart(<any>{
      chart: {
        type: 'solidgauge',
        style: {
          fontFamily: 'Roboto,"Helvetica Neue",sans-serif'
        }
      },
      title: {
        text: null
      },
      pane: {
        center: ['50%', '62%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: ((<any>Highcharts).theme && (<any>Highcharts).theme.background2) || '#EEE',
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
            y: 15,
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
        data: [],
        dataLabels: {
          crop: false,
          overflow: 'allow',
          format:
            `<div style = "text-align: center; vertical-align: bottom; color: '${((<any>Highcharts).theme && (<any>Highcharts).theme.contrastTextColor) || 'black'}'">
               <span style = "font-size: 25px">{y:.2f}</span>
               <span style = "font-size: 12px">${this.tag.engineeringUnits == null ? "" : "&nbsp" + this.tag.engineeringUnits}</span>
             </div>`
        }
      }]
    });
  }

  ngAfterViewInit() {
    this.chart.ref$.subscribe(chartObj => {
      this.internalChart = chartObj;
      this.resize();
    });
  }

  ngOnDestroy() {
    this.internalChart = null;
  }

  resize() {
    // reflow must be done after chart is fully created
    window.setTimeout(() => {
      // and before it is destroyed
      if (this.internalChart !== null) {
        this.internalChart.reflow();
      }
    });
  }

  getContentWidth(): number {
    return (<any>this.internalChart).plotWidth;
  }

  set data(data: TagData) {
    if ((<any>this.internalChart.series[0]).points.length === 0) {
      this.internalChart.series[0].addPoint(data.values[0].value);
    } else {
      (<any>this.internalChart.series[0]).points[0].update(data.values[0].value);
    }
  }
}
