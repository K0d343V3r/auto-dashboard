import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefaultColorService {
  private colors: Map<string, number> = new Map<string, number>();

  readonly stopColor: string = "#EF5350";
  readonly goColor: string = "#66BB6A";
  readonly readyColor: string = "#FFEE58";
  readonly disabledColor: string = "#9E9E9E";

  constructor() { 
    // default Highcharts colors
    // this.colors.set("#7cb5ec", 0);
    // this.colors.set("#434348", 0);
    // this.colors.set("#90ed7d", 0);
    // this.colors.set("#f7a35c", 0);
    // this.colors.set("#8085e9", 0);
    // this.colors.set("#f15c80", 0);
    // this.colors.set("#e4d354", 0);
    // this.colors.set("#2b908f", 0);
    // this.colors.set("#f45b5b", 0);
    // this.colors.set("#f45b5b", 0);

    // hand-picked material design colors
    // https://material.io/archive/guidelines/style/color.html#color-color-palette
    this.colors.set("#42A5F5", 0);
    this.colors.set(this.stopColor, 0);
    this.colors.set(this.goColor, 0);
    this.colors.set("#795548", 0);
    this.colors.set("#26C6DA", 0);
    this.colors.set("#7E57C2", 0);
    this.colors.set("#8BC34A", 0);
    this.colors.set("#FF9800", 0);
    this.colors.set("#607D8B", 0);
    this.colors.set("#E91E63", 0);
  }

  getNewColor() {
    // find color that has been used the least
    let usage = Number.MAX_VALUE;
    let color;
    this.colors.forEach((value, key) => {
      if (value < usage) {
        usage = value;
        color = key;
      }
    });

    // reserve color
    this.colors.set(color, usage + 1);

    return color;
  }

  releaseColor(color: string) {
    const usage = this.colors.get(color);
    if (usage != null) {
      // this is a tracked color, release it
      this.colors.set(color, usage - 1);
    }
  }

  reserveColor(color: string) {
    const usage = this.colors.get(color);
    if (usage != null) {
      // this is a tracked color, reserve it
      this.colors.set(color, usage + 1);
    }  
  }
}
