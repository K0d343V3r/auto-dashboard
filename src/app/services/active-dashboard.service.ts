import { Injectable } from '@angular/core';
import { DashboardDefinition, DashboardTile } from '../proxies/dashboard-api';
import { Subject } from 'rxjs';
import { TagId } from '../proxies/data-simulator-api';

@Injectable({
  providedIn: 'root'
})
export class ActiveDashboardService {
  private readonly defaultDefinition: DashboardDefinition;
  private definition: DashboardDefinition;
  private definitionChangedSource = new Subject();

  isDirty: boolean = false;
  definitionChanged$ = this.definitionChangedSource.asObservable();

  constructor() { 
    // initialize default definition
    this.defaultDefinition = new DashboardDefinition({
      // position = -1, appends to end of collection
      id: 0, position: -1, name: '', title: 'New Dashboard', columns: 0, tiles: []
    });

    // start with default definition
    this.definition = this.defaultDefinition.clone();
  }

  get id(): number {
    return this.definition.id;
  }

  get name(): string {
    return this.definition.name;
  }

  set name(value: string) {
    if (this.definition.name !== value) {
      this.definition.name = value;
      this.isDirty = true;
    }
  }

  get title(): string {
    if (this.definition.title !== null) {
      return this.definition.title;
    } else {
      return this.definition.name;
    }
  }

  set title(value: string) {
    if (this.definition.title !== value) {
      this.definition.title = value;
      this.isDirty = true;
    }
  }

  get position(): number {
    return this.definition.position;
  }

  set position(value: number) {
    if (this.definition.position !== value) {
      this.definition.position = value;
      this.isDirty = true;
    }
  }

  get columns(): number {
    return this.definition.columns;
  }

  get tiles(): DashboardTile[] {
    return this.definition.tiles;
  }

  addTag(tagId: TagId, important: boolean) {
    if (this.definition.tiles.find(t => t.tagId == tagId) == null) {
      const dashboardTile = new DashboardTile();
      dashboardTile.tagId = tagId;
      dashboardTile.important = important;
      this.definition.tiles.push(dashboardTile);
      this.isDirty = true;
      this.relayout();
    }
  }

  private relayout() {
    // TODO
  }

  removeTag(tagId: TagId) {
    const index = this.definition.tiles.findIndex(t => t.tagId == tagId);
    if (index >= 0) {
      this.definition.tiles.splice(index, 1);
      this.isDirty = true;
      this.relayout();
    }
  }

  load(definition: DashboardDefinition) {
    this.definition = definition.clone();
    this.isDirty = false;
    this.definitionChangedSource.next();
  }

  reset() {
    this.definition = this.defaultDefinition.clone();
    this.isDirty = false;
    this.definitionChangedSource.next();
  }

  getDefinition(): DashboardDefinition {
    return this.definition.clone();
  }
}
