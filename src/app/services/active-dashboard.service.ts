import { Injectable } from '@angular/core';
import { DashboardDefinition, DashboardTile, DefinitionsProxy, RequestType, TimePeriod } from '../proxies/dashboard-api';
import { Subject } from 'rxjs';
import { TagId } from '../proxies/data-simulator-api';
import { LayoutSchemeService, LayoutItem } from './layout-scheme.service';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IReversibleChanges, RequestTimeFrame } from './i-reversible-changes';

@Injectable({
  providedIn: 'root'
})
export class ActiveDashboardService implements IReversibleChanges {
  private readonly defaultDefinition: DashboardDefinition;
  private definition: DashboardDefinition;
  private definitionLoadedSource = new Subject();
  private definitionChangedSource = new Subject();
  private tileAddedSource = new Subject();
  private tileRemovedSource = new Subject();
  private layoutChangedSource = new Subject();
  private requestTypeChangedSource = new Subject();

  isDirty: boolean = false;
  definitionLoaded$ = this.definitionLoadedSource.asObservable();
  definitionChanged$ = this.definitionChangedSource.asObservable();
  tileAdded$ = this.tileAddedSource.asObservable();
  tileRemoved$ = this.tileRemovedSource.asObservable();
  layoutChanged$ = this.layoutChangedSource.asObservable();
  requestTypeChanged$ = this.requestTypeChangedSource.asObservable();

  constructor(
    private layoutSchemeService: LayoutSchemeService,
    private definitionsProxy: DefinitionsProxy
  ) {
    // initialize default definition
    this.defaultDefinition = new DashboardDefinition({
      // position = -1, appends to end of collection
      id: 0, position: -1, name: 'New Dashboard', columns: 0, requestType: RequestType.Live, tiles: []
    });

    // start with default definition
    this.definition = this.defaultDefinition.clone();
  }

  get id(): number {
    return this.definition.id;
  }

  get columns(): number {
    return this.definition.columns;
  }

  get tiles(): DashboardTile[] {
    return this.definition.tiles;
  }

  get requestType(): RequestType {
    return this.definition.requestType;
  }

  getRequestTimeFrame(): RequestTimeFrame {
    if (this.definition.requestType === RequestType.Live) {
      return null;
    } else {
      const timeFrame = new RequestTimeFrame();
      timeFrame.targetTime = this.definition.valueAtTimeTarget;
      timeFrame.timePeriod = this.definition.historyTimePeriod;
      return timeFrame;
    }
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
    if (this.definition.title != null) {
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

  addTag(tagId: TagId) {
    if (this.definition.tiles.find(t => t.tagId == tagId) == null) {
      const dashboardTile = new DashboardTile();
      dashboardTile.tagId = tagId;
      this.definition.tiles.push(dashboardTile);
      this.isDirty = true;
      this.layout();
      this.tileAddedSource.next();
    }
  }

  private layout() {
    // get new tile layout, based on number of tiles and importance
    const importantCount = this.definition.tiles.filter(t => t.important).length;
    const scheme = this.layoutSchemeService.getLayout(importantCount, this.definition.tiles.length);

    // apply column scheme
    this.definition.columns = scheme.columns;

    // apply tile scheme 
    this.applyTileScheme(scheme.items);

    // and notify
    this.layoutChangedSource.next();
  }

  private applyTileScheme(items: LayoutItem[]) {
    const tiles: DashboardTile[] = [];
    for (let item of items) {
      let index = this.definition.tiles.findIndex(t => t.important === item.primary);
      if (index < 0) {
        // layout service may not return any primary items if too many requested
        index = 0;
      }
      const removedTile = this.definition.tiles.splice(index, 1)[0];
      removedTile.columnSpan = item.columnSpan;
      removedTile.rowSpan = item.rowSpan;
      tiles.push(removedTile);
    }

    this.definition.tiles = tiles;
  }

  removeTag(tagId: TagId) {
    const index = this.definition.tiles.findIndex(t => t.tagId == tagId);
    if (index >= 0) {
      this.definition.tiles.splice(index, 1);
      this.isDirty = true;
      this.layout();
      this.tileRemovedSource.next();
    }
  }

  toggleTagImportance(tagId: TagId) {
    const index = this.definition.tiles.findIndex(t => t.tagId == tagId);
    if (index >= 0) {
      this.definition.tiles[index].important = !this.definition.tiles[index].important;
      this.isDirty = true;
      this.layout();
    }
  }

  changeRequestType(requestType: RequestType, timeFrame: RequestTimeFrame = null) {
    this.definition.requestType = requestType;
    if (timeFrame === null) {
      this.definition.historyTimePeriod = null;
      this.definition.valueAtTimeTarget = null;
    } else {
      this.definition.historyTimePeriod = timeFrame.timePeriod;
      this.definition.valueAtTimeTarget = timeFrame.targetTime;
    }
    this.isDirty = true;
    this.requestTypeChangedSource.next();
  }

  load(definition: DashboardDefinition) {
    this.loadDefinition(definition.clone());
  }

  reset() {
    this.loadDefinition(this.defaultDefinition.clone());
  }

  save(): Observable<void> {
    if (this.definition.id === 0) {
      // create a new definition
      return this.definitionsProxy.createDefinition(this.definition).pipe(mergeMap(definition => {
        // pick up new ids for definition and tiles
        this.loadDefinition(definition);
        return of(undefined);
      }));
    } else {
      // update existing definition
      return this.definitionsProxy.updateDefinition(this.definition.id, this.definition).pipe(mergeMap(definition => {
        // pick up correct ids for newly created tiles
        this.loadDefinition(definition);
        return of(undefined);
      }));
    }
  }

  private loadDefinition(definition: DashboardDefinition) {
    const currentId = this.definition.id;
    this.definition = definition;
    this.isDirty = false;
    this.definitionLoadedSource.next();
    if (currentId != definition.id) {
      this.definitionChangedSource.next();
    }
  }
}
