import { Injectable } from '@angular/core';
import { ItemsProxy, SimulatorItem } from '../proxies/data-simulator-api';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SimulatorItemService {
  private items$: Observable<SimulatorItem[]>;

  constructor(
    private itemsProxy: ItemsProxy
  ) { }

  getAllItems(): Observable<SimulatorItem[]> {
    // item array does not change, so cache it
    if (this.items$ != null) {
      return this.items$;
    } else {
      return this.itemsProxy.getAllItems().pipe(mergeMap(items => { 
        // sort alphabetically
        items.sort((a, b) => a.name.localeCompare(b.name));
        this.items$ = of(items);
        return this.items$; 
      }));
    }
  }
}
