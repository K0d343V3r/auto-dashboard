import { Injectable } from '@angular/core';
import { TagsProxy, SimulatorTag } from '../proxies/data-simulator-api';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SimulatorTagService {
  private tags$: Observable<SimulatorTag[]>;

  constructor(
    private tagsProxy: TagsProxy
  ) { }

  getAllTags(): Observable<SimulatorTag[]> {
    // tag array does not change, so cache it
    if (this.tags$ != null) {
      return this.tags$;
    } else {
      return this.tagsProxy.getAllTags().pipe(mergeMap(tags => { 
        // sort alphabetically
        tags.sort((a, b) => a.name.localeCompare(b.name));
        this.tags$ = of(tags);
        return this.tags$; 
      }));
    }
  }
}
