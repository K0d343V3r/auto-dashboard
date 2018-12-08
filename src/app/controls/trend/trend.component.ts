import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { IDashboardControl } from '../i-dashboard-control';
import { SimulatorTag, VQT, MajorQuality, TagType } from 'src/app/proxies/data-simulator-api';
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
            enabled: this.tag.type === TagType.String
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
    // append new points
    data.values.forEach(v => {
      const value = v.quality.major === MajorQuality.Bad ? null : this.getChartValue(v.value);
      this.chartObj.series[0].addPoint([v.time.getTime(), value], false, false)
    });

    // update time axis min and max (redraws chart)
    this.chartObj.xAxis[0].setExtremes(data.startTime.getTime(), data.endTime.getTime());
  }

  private getChartValue(value: any): number {
    switch (this.tag.type) {
      case TagType.Boolean:
        return value ? 1 : 0;

      case TagType.Number:
        return value;

      case TagType.String:
        return 1;
    }
  }
}