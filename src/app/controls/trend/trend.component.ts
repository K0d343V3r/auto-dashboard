import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ITagControl } from '../i-dashboard-control';
import { SimulatorTag, MajorQuality, StringTag, BooleanTag, NumericTag, NumericType } from 'src/app/proxies/data-simulator-api';
import { TagData } from 'src/app/services/dashboard-data.service';
import { DefaultColorService } from 'src/app/services/default-color.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.css']
})
export class TrendComponent implements OnInit, OnDestroy, AfterViewInit, ITagControl {
  private internalChart: Highcharts.ChartObject;
  private color: string;

  @Input() item: SimulatorTag;
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
            enabled: this.item instanceof StringTag
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
        tickInterval: this.item instanceof BooleanTag ? 1 : undefined,
        labels: {
          enabled: !(this.item instanceof StringTag),
          formatter: ((context: Highcharts.AxisLabelFormatterOptions): string => {
            return this.getAxisLabel(context.value);
          })
        }
      },
      time: {
        useUTC: false
      },
      tooltip: {
        pointFormat: `<span style="color:{point.color}">\u25CF</span> {series.name}: <b>${this.getTooltipToken()}</b><br/>`,
        xDateFormat: this.timeService.getHighchartsDateFormat()
      },
      series: [
        <any>{                                  // using "any" - step not in type definition  
          name: `${this.item.name}`,
          data: [],
          step: this.item instanceof NumericTag && (<NumericTag>this.item).type !== NumericType.Float
        }
      ]
    });
  }

  private getTooltipToken(): string {
    if (this.item instanceof NumericTag) {
      return "{point.y}";
    } else {
      return "{point.tooltipValue}";
    }
  }

  private getAxisLabel(value: number): string {
    if (this.item instanceof BooleanTag) {
      return this.getBooleanLabel(value === 1);
    } else {
      return value.toString();
    }
  }

  private getBooleanLabel(value: boolean): string {
    if (value) {
      return (<BooleanTag>this.item).trueLabel != null ? (<BooleanTag>this.item).trueLabel : "True";
    } else {
      return (<BooleanTag>this.item).falseLabel != null ? (<BooleanTag>this.item).falseLabel : "False";
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
    if (this.item instanceof BooleanTag) {
      return this.getBooleanLabel(value);
    } else if (this.item instanceof StringTag) {
      return this.timeService.toDateString(new Date(value));
    } else {
      return null;
    }
  }

  private getCharttingValue(value: any): number {
    if (this.item instanceof BooleanTag) {
      return value ? 1 : 0;
    } else if (this.item instanceof StringTag) {
      return 1;
    } else {
      return value;
    }
  }
}