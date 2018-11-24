import { Injectable } from '@angular/core';
import { DashboardDefinition, DashboardTag } from '../proxies/dashboard-api';
import { Subject } from 'rxjs';
import { TagId } from '../proxies/data-simulator-api';

@Injectable({
  providedIn: 'root'
})
export class ActiveDashboardService {
  private readonly defaultDefinition: DashboardDefinition;
  private definition: DashboardDefinition;

  private nameChangedSource = new Subject<string>();
  nameChanged$ = this.nameChangedSource.asObservable();

  private titleChangedSource = new Subject<string>();
  titleChanged$ = this.titleChangedSource.asObservable();

  private positionChangedSource = new Subject<number>();
  positionChanged$ = this.positionChangedSource.asObservable();

  private tagAddedSource = new Subject<DashboardTag>();
  tagAdded$ = this.tagAddedSource.asObservable();
  private tagRemovedSource = new Subject<DashboardTag>();
  tagRemoved$ = this.tagRemovedSource.asObservable();

  private definitionChangedSource = new Subject();
  definitionChanged$ = this.definitionChangedSource.asObservable();

  constructor() { 
    // initialize default definition
    this.defaultDefinition = new DashboardDefinition({
      // position = -1, appends to end of collection
      id: 0, position: -1, name: '', title: 'New Dashboard', tags: []
    });

    // start with default definition
    this.definition = this.defaultDefinition.clone()
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
      this.nameChangedSource.next(value);
    }
  }

  get title(): string {
    return this.definition.title;
  }

  set title(value: string) {
    if (this.definition.title !== value) {
      this.definition.title = value;
      this.titleChangedSource.next(value);
    }
  }

  get position(): number {
    return this.definition.position;
  }

  set position(value: number) {
    if (this.definition.position !== value) {
      this.definition.position = value;
      this.positionChangedSource.next(value);
    }
  }

  addTag(tag: TagId) {
    if (this.definition.tags.find(t => t.id == tag) == null) {
      const dashboardTag = new DashboardTag();
      dashboardTag.tag = tag;
      this.definition.tags.push(dashboardTag);
      this.tagAddedSource.next(dashboardTag);
    }
  }

  removeTag(tag: TagId) {
    const index = this.definition.tags.findIndex(t => t.id == tag);
    if (index >= 0) {
      const dashboardTags = this.definition.tags.splice(index, 1);
      this.tagRemovedSource.next(dashboardTags[0]);
    }
  }

  load(definition: DashboardDefinition) {
    this.definition = definition.clone();
    this.definitionChangedSource.next();
  }

  reset() {
    this.definition = this.defaultDefinition.clone();
    this.definitionChangedSource.next();
  }

  getDefinition(): DashboardDefinition {
    // return clone to avoid changes to internal state
    return this.definition.clone();
  }
}
