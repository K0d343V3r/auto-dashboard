import { Injectable } from '@angular/core';
import { DashboardDefinition, DashboardTile, DefinitionsProxy, RequestType, TimePeriod } from '../../proxies/dashboard-api';
import { Subject } from 'rxjs';
import { ItemId } from '../../proxies/data-simulator-api';
import { LayoutSchemeService, LayoutItem } from '../layout-scheme.service';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IReversibleChanges, RequestTimeFrame } from '../i-reversible-changes';
import { DashboardDisplaySettings, RefreshScale } from './dashboard-display-settings';

export interface ITileReference {
  index: number;
  tile: DashboardTile;
}

@Injectable({
  providedIn: 'root'
})
export class ActiveDashboardService implements IReversibleChanges {
  private readonly defaultDefinition: DashboardDefinition;
  private _definition: DashboardDefinition;
  private displaySettings: DashboardDisplaySettings;

  private definitionLoadedSource = new Subject();
  private definitionChangedSource = new Subject();
  private tileAddedSource = new Subject<DashboardTile>();
  private tileRemovedSource = new Subject<DashboardTile>();
  private layoutChangedSource = new Subject();
  private requestTypeChangedSource = new Subject();
  private titleChangedSource = new Subject();
  private refreshRateChangedSource = new Subject();

  isDirty: boolean = false;
  definitionLoaded$ = this.definitionLoadedSource.asObservable();
  definitionChanged$ = this.definitionChangedSource.asObservable();
  tileAdded$ = this.tileAddedSource.asObservable();
  tileRemoved$ = this.tileRemovedSource.asObservable();
  layoutChanged$ = this.layoutChangedSource.asObservable();
  requestTypeChanged$ = this.requestTypeChangedSource.asObservable();
  titleChanged$ = this.titleChangedSource.asObservable();
  refreshRateChanged$ = this.refreshRateChangedSource.asObservable();

  constructor(
    private layoutSchemeService: LayoutSchemeService,
    private definitionsProxy: DefinitionsProxy
  ) {
    // initialize default definition
    this.defaultDefinition = new DashboardDefinition({
      // position = -1, appends to end of collection
      id: 0, position: -1, name: 'New Dashboard', columns: 0, requestType: RequestType.Live, tiles: [], settings: [], dashboardFolderId: 1
    });

    // start with default definition
    this.definition = this.defaultDefinition.clone();
  }

  private get definition(): DashboardDefinition {
    return this._definition;
  }

  private set definition(value: DashboardDefinition) {
    this._definition = value;
    this.displaySettings = new DashboardDisplaySettings(value);
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
      return new RequestTimeFrame(this.definition.valueAtTimeTarget, this.definition.historyTimePeriod);
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

  get position(): number {
    return this.definition.position;
  }

  set position(value: number) {
    if (this.definition.position !== value) {
      this.definition.position = value;
      this.isDirty = true;
    }
  }

  get dashboardFolderId(): number {
    return this.definition.dashboardFolderId;
  }

  addItem(itemId: ItemId): ITileReference {
    if (this.definition.tiles.find(t => t.sourceId == itemId) == null) {
      const tile = new DashboardTile();
      tile.sourceId = itemId;
      this.insertTile(this.definition.tiles.length, tile);
      return { index: this.definition.tiles.length, tile: tile };
    }

    return null;
  }

  insertTile(index: number, tile: DashboardTile) {
    this.definition.tiles.splice(index, 0, tile);
    this.isDirty = true;
    this.layout();
    this.tileAddedSource.next(tile);
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

  removeItem(itemId: ItemId): ITileReference {
    const index = this.definition.tiles.findIndex(t => t.sourceId == itemId);
    if (index >= 0) {
      const tile = this.definition.tiles.splice(index, 1)[0];
      this.isDirty = true;
      this.layout();
      this.tileRemovedSource.next(tile);
      return { index: index, tile: tile };
    }

    return null;
  }

  toggleItemImportance(itemId: ItemId) {
    const index = this.definition.tiles.findIndex(t => t.sourceId == itemId);
    if (index >= 0) {
      this.definition.tiles[index].important = !this.definition.tiles[index].important;
      this.isDirty = true;
      this.layout();
    }
  }

  setRequestType(requestType: RequestType, timeFrame: RequestTimeFrame = null) {
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

  get title(): string {
    return this.displaySettings.title;
  }

  set title(title: string) {
    if (this.displaySettings.setTitle(title)) {
      this.isDirty = true;
      this.titleChangedSource.next();
    }
  }
  
  get refreshRate(): number {
    return this.displaySettings.refreshRate;
  }

  get refreshScale(): RefreshScale {
    return this.displaySettings.refreshScale;
  }

  setRefreshRate(refreshRate: number, refreshScale: RefreshScale) {
    const changed1 = this.displaySettings.setRefreshRate(refreshRate);
    const changed2 = this.displaySettings.setRefreshScale(refreshScale);
    if (changed1 || changed2) {
      this.isDirty = true;
      this.refreshRateChangedSource.next();
    }
  }

  load(definition: DashboardDefinition) {
    this.loadDefinition(definition.clone());
  }

  reset(folderId: number = 0) {
    let definition = this.defaultDefinition.clone();
    definition.dashboardFolderId = folderId;
    this.loadDefinition(definition);
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
