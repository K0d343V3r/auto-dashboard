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
  constructor(private definition: DashboardDefinition, private setDirty: () => void) { }

  get title(): string {
    const setting = this.definition.settings.find(d => d.settingId === <number>SettingId.Title);
    if (setting != null && setting.stringValue != "") {
      return setting.stringValue;
    } else {
      // if there is no title, default to definition name
      return this.definition.name;
    }
  }

  set title(value: string) {
    let setting = this.definition.settings.find(d => d.settingId === <number>SettingId.Title);
    if (setting != null) {
      if (setting.stringValue !== value) {
        setting.stringValue = value;
        this.setDirty();
      }
    } else {
      setting = new DashboardSetting();
      setting.settingId = SettingId.Title;
      setting.stringValue = value;
      setting.dashboardDefinitionId = this.definition.id;
      this.definition.settings.push(setting);
      this.setDirty();
    }
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

  set refreshRate(value: number) {
    let setting = this.definition.settings.find(d => d.settingId === <number>SettingId.RefreshRate);
    if (setting != null) {
      if (setting.numberValue !== value) {
        setting.numberValue = value;
        this.setDirty();
      }
    } else {
      setting = new DashboardSetting();
      setting.settingId = SettingId.RefreshRate;
      setting.numberValue = value;
      setting.dashboardDefinitionId = this.definition.id;
      this.definition.settings.push(setting);
      this.setDirty();
    }
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

  set refreshScale(value: RefreshScale) {
    let setting = this.definition.settings.find(d => d.settingId === <number>SettingId.RefreshScale);
    if (setting != null) {
      if (setting.numberValue !== <number>value) {
        setting.numberValue = value;
        this.setDirty();
      }
    } else {
      setting = new DashboardSetting();
      setting.settingId = SettingId.RefreshScale;
      setting.numberValue = value;
      setting.dashboardDefinitionId = this.definition.id;
      this.definition.settings.push(setting);
      this.setDirty();
    }
  }
}