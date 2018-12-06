import { Injectable } from '@angular/core';
import { IReversibleChanges } from './i-reversible-changes';
import { ActiveDashboardService } from './active-dashboard.service';
import { TagId } from '../proxies/data-simulator-api';
import { RequestType, TimePeriod } from '../proxies/dashboard-api';
import { Subscription } from 'rxjs';

abstract class ReversibleChange {
  constructor(protected activeDashboardService: ActiveDashboardService) { }

  abstract commit();
  abstract revert();
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

class TagChange extends ReversibleChange {
  constructor(activeDashboardService: ActiveDashboardService, private tagId: TagId, private add: boolean) {
    super(activeDashboardService);
  }

  commit() {
    if (this.add) {
      this.activeDashboardService.addTag(this.tagId);
    } else {
      this.activeDashboardService.removeTag(this.tagId);
    }
  }

  revert() {
    if (this.add) {
      this.activeDashboardService.removeTag(this.tagId);
    } else {
      this.activeDashboardService.addTag(this.tagId);
    }
  }
}

class ImportanceChange extends ReversibleChange {
  constructor(activeDashboardService: ActiveDashboardService, private tagId: TagId) {
    super(activeDashboardService);
  }

  commit() {
    this.activeDashboardService.toggleTagImportance(this.tagId);
  }

  revert() {
    this.activeDashboardService.toggleTagImportance(this.tagId);
  }
}

class RequestTypeChange extends ReversibleChange {
  private previousRequestType: RequestType;
  private previousTimePeriod: TimePeriod;

  constructor(activeDashboardService: ActiveDashboardService, private requestType: RequestType, private timePeriod: TimePeriod) {
    super(activeDashboardService);
  }

  commit() {
    this.previousRequestType = this.activeDashboardService.requestType;
    this.previousTimePeriod = this.activeDashboardService.timePeriod;
    this.activeDashboardService.changeRequestType(this.requestType, this.timePeriod);
  }

  revert() {
    this.activeDashboardService.changeRequestType(this.previousRequestType, this.previousTimePeriod);
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

  get title(): string {
    return this.activeDashboardService.title;
  }

  set title(value: string) {
    this.processChange(new TitleChange(this.activeDashboardService, value));
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

  addTag(tagId: TagId) {
    this.processChange(new TagChange(this.activeDashboardService, tagId, true));
  }

  removeTag(tagId: TagId) {
    this.processChange(new TagChange(this.activeDashboardService, tagId, false));
  }

  toggleTagImportance(tagId: TagId) {
    this.processChange(new ImportanceChange(this.activeDashboardService, tagId));
  }

  changeRequestType(requestType: RequestType, timePeriod: TimePeriod) {
    this.processChange(new RequestTypeChange(this.activeDashboardService, requestType, timePeriod));
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
