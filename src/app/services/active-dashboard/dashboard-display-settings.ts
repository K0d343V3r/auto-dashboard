import { DashboardDefinition, DashboardSetting } from "src/app/proxies/dashboard-api";

enum SettingId {
  Title,
  RefreshRate,
  RefreshScale
}

export enum RefreshScale {
  Seconds,
  Minutes,
  Hours
}

export class DashboardDisplaySettings {
  constructor(private definition: DashboardDefinition) { }

  get title(): string {
    const setting = this.definition.settings.find(d => d.settingId === <number>SettingId.Title);
    if (setting != null) {
      return setting.stringValue;
    } else {
      return "";
    }
  }

  setTitle(value: string): boolean {
    let setting = this.definition.settings.find(d => d.settingId === <number>SettingId.Title);
    if (setting != null) {
      if (setting.stringValue !== value) {
        setting.stringValue = value;
        return true;
      }
    } else {
      setting = new DashboardSetting();
      setting.settingId = SettingId.Title;
      setting.stringValue = value;
      setting.dashboardDefinitionId = this.definition.id;
      this.definition.settings.push(setting);
      return true;
    }
    return false;
  }

  get refreshRate(): number {
    const setting = this.definition.settings.find(d => d.settingId === <number>SettingId.RefreshRate);
    if (setting != null) {
      return setting.numberValue;
    } else {
      // default is 2 seconds
      return 2;
    }
  }

  setRefreshRate(value: number): boolean {
    let setting = this.definition.settings.find(d => d.settingId === <number>SettingId.RefreshRate);
    if (setting != null) {
      if (setting.numberValue !== value) {
        setting.numberValue = value;
        return true;
      }
    } else {
      setting = new DashboardSetting();
      setting.settingId = SettingId.RefreshRate;
      setting.numberValue = value;
      setting.dashboardDefinitionId = this.definition.id;
      this.definition.settings.push(setting);
      return true;
    }
    return false;
  }

  get refreshScale(): RefreshScale {
    const setting = this.definition.settings.find(d => d.settingId === <number>SettingId.RefreshScale);
    if (setting != null) {
      return setting.numberValue;
    } else {
      // default is 2 seconds
      return RefreshScale.Seconds;
    }
  }

  setRefreshScale(value: RefreshScale): boolean {
    let setting = this.definition.settings.find(d => d.settingId === <number>SettingId.RefreshScale);
    if (setting != null) {
      if (setting.numberValue !== <number>value) {
        setting.numberValue = value;
        return true;
      }
    } else {
      setting = new DashboardSetting();
      setting.settingId = SettingId.RefreshScale;
      setting.numberValue = value;
      setting.dashboardDefinitionId = this.definition.id;
      this.definition.settings.push(setting);
      return true;
    }
    return false;
  }
}