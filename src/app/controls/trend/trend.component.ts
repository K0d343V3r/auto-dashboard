import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { IDashboardControl } from '../i-dashboard-control';
import { SimulatorTag, MajorQuality, TagType } from 'src/app/proxies/data-simulator-api';
import { TagData } from 'src/app/services/dashboard-data.service';
import { DefaultColorService } from 'src/app/services/default-color.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.css']
})
export class TrendComponent implements OnInit, OnDestroy, AfterViewInit, IDashboardControl {
  private internalChart: Highcharts.ChartObject;
  private color: string;

  @Input() tag: SimulatorTag;
  chart: Chart;

  constructor(
    private defaultColorService: DefaultColorService,
    private timeService: TimeService
  ) { }

  ngOnInit() {
    this.color = this.defaultColorService.getNewColor();

    this.chart = new Chart({
      chart: {
        type: 'line',
        spacingTop: 12,
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
          marker: {
            enabled: this.tag.type === TagType.String
          }
        },
        series: {
          color: this.color
        }
      },
      xAxis: {
        type: 'datetime',
        // set 12 hour AM/PM format
        dateTimeLabelFormats: {
          millisecond: '%l:%M:%S.%L %p',
          second: '%l:%M:%S %p',
          minute: '%l:%M %p',
          hour: '%l:%M %p',
        }
      },
      yAxis: <any>{
        title: {
          text: null
        },
        maxPadding: 0,
        minPadding: 0,
        tickInterval: this.tag.type === TagType.Boolean ? 1 : undefined,
        labels: {
          enabled: this.tag.type !== TagType.String,
          formatter: ((context: Highcharts.AxisLabelFormatterOptions): string => {
            return this.getAxisLabel(context.value);
          })
        }
      },
      time: {
        useUTC: false
      },
      tooltip: {
        pointFormat: `<span style="color:{point.color}">\u25CF</span> {series.name}: <b>${this.getTooltipToken()}</b><br/>`
      },
      series: [
        <any>{                                  // using "any" - step not in type definition  
          name: `${this.tag.name}`,
          data: [],
          step: this.tag.type !== TagType.Float
        }
      ]
    });
  }

  private getTooltipToken(): string {
    if (this.tag.type === TagType.Float || this.tag.type === TagType.Integer) {
      return "{point.y}";
    } else {
      return "{point.tooltipValue}";
    }
  }

  private getAxisLabel(value: number): string {
    if (this.tag.type === TagType.Boolean) {
      return this.getBooleanLabel(value === 1);
    } else {
      return value.toString();
    }
  }

  private getBooleanLabel(value: boolean): string {
    if (value) {
      return this.tag.trueLabel != null ? this.tag.trueLabel : "True";
    } else {
      return this.tag.falseLabel != null ? this.tag.falseLabel : "False";
    }
  }

  ngOnDestroy() {
    // put color back in the color pool
    this.defaultColorService.releaseColor(this.color);

    // internal chart will be destroyed by Chart directive, do not use it anymore
    this.internalChart = null;
  }

  ngAfterViewInit() {
    this.chart.ref$.subscribe(chartObj => {
      this.internalChart = chartObj;
      this.resize();
    });
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
    // make sure chart extends to parent container (otherwise plotWidth == 0)
    this.internalChart.reflow();

    // and return width of plotting area
    return (<any>this.internalChart).plotWidth;
  }

  set data(data: TagData) {
    // append new points
    data.values.forEach(v => {
      const value = v.quality.major === MajorQuality.Bad ? null : this.getCharttingValue(v.value);
      this.internalChart.series[0].addPoint(<any>{
        x: v.time.getTime(),
        y: value,
        tooltipValue: this.getTooltipValue(v.value)
      }, false, false)
    });

    // update time axis min and max (redraws chart)
    this.internalChart.xAxis[0].setExtremes(data.startTime.getTime(), data.endTime.getTime());
  }

  private getTooltipValue(value: any): string {
    if (this.tag.type === TagType.Boolean) {
      return this.getBooleanLabel(value);
    } else if (this.tag.type === TagType.String) {
      return this.timeService.toDateString(new Date(value), true);
    } else {
      return null;
    }
  }

  private getCharttingValue(value: any): number {
    switch (this.tag.type) {
      case TagType.Boolean:
        return value ? 1 : 0;

      case TagType.Float:
      case TagType.Integer:
        return value;

      case TagType.String:
        return 1;
    }
  }
}