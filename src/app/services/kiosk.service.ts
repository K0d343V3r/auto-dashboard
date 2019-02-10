import { Injectable } from '@angular/core';
import { FolderElement, KioskTimeScale, DefinitionElement } from '../proxies/dashboard-api';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class KioskService {
  private intervalID: number = null;

  constructor(
    private navigationService: NavigationService
  ) { }

  startKiosk(folder: FolderElement, dashboards: DefinitionElement[]) {
    // stop any ongoing kiosk mode
    this.stopKiosk();

    if (dashboards.length > 0) {
      // enter full screen mode
      this.navigationService.openFullscreen();

      // navigate to first dashboard, do not replace url
      let index: number = 0;
      this.navigationService.kioskDashboard(dashboards[index++].id);

      this.intervalID = window.setInterval(() => {
        if (index === dashboards.length) {
          // we displayed all dashboards in folder, start over
          index = 0;
        }
        // replace kiosk urls to prevent entering kiosk via Back button
        this.navigationService.kioskDashboard(dashboards[index++].id, true);
      }, this.getInterval(folder) * 1000);
    }
  }

  stopKiosk() {
    if (this.intervalID != null) {
      window.clearInterval(this.intervalID);
      this.intervalID = null;

      // exit full screen mode
      this.navigationService.closeFullscreen();
    }
  }

  private getInterval(folder: FolderElement): number {
    switch (folder.kioskTimeScale) {
      case KioskTimeScale.Seconds:
        return folder.kioskInterval;

      case KioskTimeScale.Minutes:
        return folder.kioskInterval * 60;

      case KioskTimeScale.Hours:
        return folder.kioskInterval * 60 * 60;

      default:
        throw "Invalid kiosk time scale.";
    }
  }
}
