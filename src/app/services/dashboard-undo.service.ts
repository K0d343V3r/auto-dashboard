import { Injectable } from '@angular/core';
import { IReversibleChanges, RequestTimeFrame } from './i-reversible-changes';
import { ActiveDashboardService, ITileReference } from './active-dashboard/active-dashboard.service';
import { ItemId } from '../proxies/data-simulator-api';
import { RequestType } from '../proxies/dashboard-api';
import { RefreshScale } from './active-dashboard/dashboard-display-settings';

abstract class ReversibleChange {
  constructor(protected activeDashboardService: ActiveDashboardService) { }

  abstract commit(): void;
  abstract revert(): void;
}

class ItemChange extends ReversibleChange {
  private removedTile: ITileReference;

  constructor(activeDashboardService: ActiveDashboardService, private itemId: ItemId, private add: boolean) {
    super(activeDashboardService);
  }

  commit() {
    if (this.add) {
      this.activeDashboardService.addItem(this.itemId);
    } else {
      this.removedTile = this.activeDashboardService.removeItem(this.itemId);
    }
  }

  revert() {
    if (this.add) {
      this.activeDashboardService.removeItem(this.itemId);
    } else if (this.removedTile !== null) {
      this.activeDashboardService.insertTile(this.removedTile.index, this.removedTile.tile);
    }
  }
}

class ImportanceChange extends ReversibleChange {
  constructor(activeDashboardService: ActiveDashboardService, private itemId: ItemId) {
    super(activeDashboardService);
  }

  commit() {
    this.activeDashboardService.toggleItemImportance(this.itemId);
  }

  revert() {
    this.activeDashboardService.toggleItemImportance(this.itemId);
  }
}

class RequestTypeChange extends ReversibleChange {
  private previousRequestType: RequestType;
  private previousTimeFrame: RequestTimeFrame;

  constructor(activeDashboardService: ActiveDashboardService, private requestType: RequestType, private timeFrame: RequestTimeFrame) {
    super(activeDashboardService);
  }

  commit() {
    this.previousRequestType = this.activeDashboardService.requestType;
    this.previousTimeFrame = this.activeDashboardService.getRequestTimeFrame();
    this.activeDashboardService.setRequestType(this.requestType, this.timeFrame);
  }

  revert() {
    this.activeDashboardService.setRequestType(this.previousRequestType, this.previousTimeFrame);
  }
}

class TitleChange extends ReversibleChange {
  private previousTitle: string;

  constructor(activeDashboardService: ActiveDashboardService, private title: string) {
    super(activeDashboardService);
  }

  commit() {
    this.previousTitle = this.activeDashboardService.title;
    this.activeDashboardService.title = this.title;
  }

  revert() {
    this.activeDashboardService.title = this.previousTitle;
  }
}

class RefreshRateChange extends ReversibleChange {
  private previousRate: number;
  private previousScale: RefreshScale;

  constructor(activeDashboardService: ActiveDashboardService, private refreshRate: number, private refreshScale: RefreshScale) {
    super(activeDashboardService);
  }

  commit() {
    this.previousRate = this.activeDashboardService.refreshRate;
    this.previousScale = this.activeDashboardService.refreshScale;
    this.activeDashboardService.setRefreshRate(this.refreshRate, this.refreshScale);
  }

  revert() {
    this.activeDashboardService.setRefreshRate(this.previousRate, this.previousScale);
  }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardUndoService implements IReversibleChanges {
  private changes: ReversibleChange[] = [];
  private restorePoint: number = -1;

  constructor(
    private activeDashboardService: ActiveDashboardService
  ) {
    this.activeDashboardService.definitionLoaded$.subscribe(() => {
      // a new definition was loaded, start over
      this.changes = [];
      this.restorePoint = -1;
    });
  }

  private processChange(change: ReversibleChange) {
    // commit change
    change.commit();

    if (this.restorePoint < this.changes.length - 1) {
      // remove obsolete "redo" points
      this.changes.splice(this.restorePoint + 1, this.changes.length - this.restorePoint - 1);
    }

    // save change and make it the current restore point
    this.restorePoint = this.changes.push(change) - 1;
  }

  addItem(itemId: ItemId) {
    this.processChange(new ItemChange(this.activeDashboardService, itemId, true));
  }

  removeItem(itemId: ItemId) {
    this.processChange(new ItemChange(this.activeDashboardService, itemId, false));
  }

  toggleItemImportance(itemId: ItemId) {
    this.processChange(new ImportanceChange(this.activeDashboardService, itemId));
  }

  setRequestType(requestType: RequestType, timeFrame: RequestTimeFrame = null) {
    this.processChange(new RequestTypeChange(this.activeDashboardService, requestType, timeFrame));
  }

  set title(title: string) {
    this.processChange(new TitleChange(this.activeDashboardService, title));
  }

  setRefreshRate(refreshRate: number, refreshScale: RefreshScale) {
    this.processChange(new RefreshRateChange(this.activeDashboardService, refreshRate, refreshScale));
  }

  canUndo(): boolean {
    return this.restorePoint >= 0;
  }

  canRedo(): boolean {
    return this.restorePoint < this.changes.length - 1;
  }

  undo() {
    if (this.canUndo()) {
      // revert change
      this.changes[this.restorePoint].revert();
      this.restorePoint--;
      if (this.restorePoint < 0) {
        // we have reverted all changes, dashboard is clean
        this.activeDashboardService.isDirty = false;
      }
    }
  }

  redo() {
    if (this.canRedo()) {
      // re-commit change
      this.restorePoint++;
      this.changes[this.restorePoint].commit();
    }
  }
}
