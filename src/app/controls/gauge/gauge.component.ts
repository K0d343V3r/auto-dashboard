import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { SimulatorTag, NumericTag } from 'src/app/proxies/data-simulator-api';
import { ITagControl } from '../i-dashboard-control';
import { Chart, Highcharts } from 'angular-highcharts';
import { TagData } from 'src/app/services/dashboard-data.service';
import { DefaultColorService } from 'src/app/services/default-color.service';
//require('highcharts/themes/grid-light')(Highcharts);  // not theming right now

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit, OnDestroy, AfterViewInit, ITagControl {
  private internalChart: Highcharts.ChartObject;

  @Input() item: SimulatorTag;
  chart: Chart;

  constructor(
    private defaultColorService: DefaultColorService
  ) { }

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
          [0.1, this.defaultColorService.goColor], // green
          [0.5, this.defaultColorService.readyColor], // yellow
          [0.9, this.defaultColorService.stopColor]  // red
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
        min: (<NumericTag>this.item).scale.min,
        max: (<NumericTag>this.item).scale.max
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
        name: this.item.name,
        data: [],
        dataLabels: {
          crop: false,
          overflow: 'allow',
          format:
            `<div style = "text-align: center; vertical-align: bottom; color: '${((<any>Highcharts).theme && (<any>Highcharts).theme.contrastTextColor) || 'black'}'">
               <span style = "font-size: 25px">{y:.2f}</span>
               <span style = "font-size: 12px">${(<NumericTag>this.item).engineeringUnits == null ? "" : "&nbsp" + (<NumericTag>this.item).engineeringUnits}</span>
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
