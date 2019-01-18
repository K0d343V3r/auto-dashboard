import { Injectable } from '@angular/core';
import { RelativeTimeScale } from '../proxies/dashboard-api';
import { RefreshScale } from './active-dashboard/dashboard-display-settings';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  resolveRelativeTime(anchorTime: Date, offset: number, timeScale: RelativeTimeScale): Date {
    let date = new Date(anchorTime);

    switch (timeScale) {
      case RelativeTimeScale.Seconds:
        date.setSeconds(anchorTime.getSeconds() + offset);
        break;

      case RelativeTimeScale.Minutes:
        date.setMinutes(anchorTime.getMinutes() + offset);
        break;

      case RelativeTimeScale.Hours:
        date.setHours(anchorTime.getHours() + offset);
        break;

      case RelativeTimeScale.Days:
        date.setDate(anchorTime.getDate() + offset);
        break;

      default:
        throw "Invalid time scale.";
    }

    return date;
  }

  toTimeString(date: Date) {
    return date.toLocaleTimeString();
  }

  toDateString(date: Date, dateFirst: boolean = false): string {
    return dateFirst ?
      `${date.toLocaleDateString()} at ${this.toTimeString(date)}` :
      `${this.toTimeString(date)} on ${date.toLocaleDateString()}`;
  }

  toRelativeTimeString(offsetFromNow: number, timeScale: RelativeTimeScale, capitalize: boolean = false): string {
    const offset = Math.abs(offsetFromNow);
    const text = offset === 1 ?
      `${offsetFromNow < 0 ? 'last' : 'next'} ${this.toTimeScaleString(timeScale, true)}` :
      `${offsetFromNow < 0 ? 'last' : 'next'} ${offset} ${this.toTimeScaleString(timeScale, false)}`;
    return capitalize ? this.capitalize(text) : text;
  }

  toRefreshRateString(refreshRate: number, refreshScale: RefreshScale, capitalize: boolean = false): string {
    const scale = this.toRelativeTimeScale(refreshScale);
    let text;
    if (refreshRate === 1) {
      text = `every ${this.toTimeScaleString(scale, true)}`;
    } else {
      text = `every ${refreshRate} ${this.toTimeScaleString(scale)}`;
    }
    return capitalize ? this.capitalize(text) : text;
  }

  private toRelativeTimeScale(refreshScale: RefreshScale): RelativeTimeScale {
    switch (refreshScale) {
      case RefreshScale.Hours:
        return RelativeTimeScale.Hours;

      case RefreshScale.Minutes:
        return RelativeTimeScale.Minutes;

      case RefreshScale.Seconds:
        return RelativeTimeScale.Seconds;

      default:
        throw "Invalid refresh scale.";
    }
  }

  private capitalize(text: string): string {
    if (text.length == 0) {
      return "";
    } else {
      return `${text.charAt(0).toLocaleUpperCase()}${text.substr(1)}`;
    }
  }

  toTimeSpanString(startTime: Date, endTime: Date, capitalize: boolean = false): string {
    let text;
    if (this.toDateOnly(startTime).getTime() === this.toDateOnly(endTime).getTime()) {
      text = `${this.toTimeString(startTime)} to ${this.toTimeString(endTime)} on ${startTime.toLocaleDateString()}`;
    } else {
      text = `${this.toDateString(startTime)} to ${this.toDateString(endTime)}`;
    }
    return capitalize ? this.capitalize(text) : text;
  }

  private toDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  toTimeScaleString(timeScale: RelativeTimeScale, singular: boolean = false, capitalize: boolean = false): string {
    let text;
    switch (timeScale) {
      case RelativeTimeScale.Seconds:
        text = singular ? "second" : "seconds";
        break;

      case RelativeTimeScale.Minutes:
        text = singular ? "minute" : "minutes";
        break;

      case RelativeTimeScale.Hours:
        text = singular ? "hour" : "hours";
        break;

      case RelativeTimeScale.Days:
        text = singular ? "day" : "days";
        break;

      default:
        throw "Invalid time scale.";
    }

    return capitalize ? this.capitalize(text) : text;
  }

  to24HourTimeString(date: Date): string {
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  }

  combine(date: Date, hour24Time: string): Date {
    const parts: string[] = hour24Time.split(':');
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), +parts[0], +parts[1], +parts[2]);
  }

  getHighchartsDateFormat(): string {
    return "%l:%M:%S %p on %m/%d/%Y";
  }
}
