import { Injectable } from '@angular/core';
import { ItemsProxy, SimulatorItem } from '../proxies/data-simulator-api';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SimulatorTagService {
  private tags$: Observable<SimulatorItem[]>;

  constructor(
    private tagsProxy: ItemsProxy
  ) { }

  getAllTags(): Observable<SimulatorItem[]> {
    // tag array does not change, so cache it
    if (this.tags$ != null) {
      return this.tags$;
    } else {
      return this.tagsProxy.getAllItems().pipe(mergeMap(tags => { 
        // sort alphabetically
        tags.sort((a, b) => a.name.localeCompare(b.name));
        this.tags$ = of(tags);
        return this.tags$; 
      }));
    }
  }
}
