import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { IDashboardControl } from '../i-dashboard-control';
import { SimulatorTag, VQT, MajorQuality } from 'src/app/proxies/data-simulator-api';
import { TagData } from 'src/app/services/dashboard-data.service';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.css']
})
export class TrendComponent implements OnInit, AfterViewInit, IDashboardControl {
  private chartObj: Highcharts.ChartObject;

  @Input() tag: SimulatorTag;
  chart: Chart;

  constructor() { }

  ngOnInit() {
    this.chart = new Chart({
      chart: {
        type: 'line',
        spacingTop: 15,
        spacingBottom: 12,  // NOTE: use 8 when legend is turned on
        spacingLeft: 12,    // NOTE: use 8 when y-axis titles are turned on
        spacingRight: 12,
        style: {
          fontFamily: 'Roboto,"Helvetica Neue",sans-serif'
        }
      },
      legend: {
        enabled: false
      },
      title: {
        text: null
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        line: {
          step: true,
          marker: {
            enabled: false
          }
        }
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: null
        }
      },
      series: [
        {
          name: `${this.tag.name}`,
          data: []
        }
      ]
    });

  }

  ngAfterViewInit() {
    this.chart.ref$.subscribe(chartObj => {
      this.chartObj = chartObj;
      this.resize();
    });
  }

  resize() {
    // reflow must be done after chart is fully created
    window.setTimeout(() => { this.chartObj.reflow(); });
  }

  set data(data: TagData) {
    data.values.forEach(v => {
      this.chartObj.series[0].addPoint([v.time.getTime(), v.quality.major === MajorQuality.Bad ? null : v.value], false, false)
      });
    this.chartObj.redraw();
  }
}
