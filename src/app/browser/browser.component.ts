import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardDefinition, DefinitionsProxy } from '../proxies/dashboard-api';
import { Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit, OnDestroy {
  private navigationEndSubscription: Subscription;

  definitions: DashboardDefinition[] = [];
  selectedDefinitionIndex: number = -1;

  constructor(
    private definitionsProxy: DefinitionsProxy,
    private router: Router
  ) {
    const navigationEnd$ = this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)) as Observable<NavigationEnd>;
    this.navigationEndSubscription = navigationEnd$.subscribe(event => this.onUrlChanged(event.url));
  }

  ngOnInit() {
    this.definitionsProxy.getAllDefinitions().subscribe(definitions => { this.definitions = definitions; });
  }

  ngOnDestroy() {
    this.navigationEndSubscription.unsubscribe();
  }

  private onUrlChanged(url: string) {
    const parts: string[] = url.split("/");
    if (parts.length == 3 && parts[1] == "viewer") {
      // parts[2] contains definition id
      this.selectedDefinitionIndex = this.definitions.findIndex(l => l.id == +parts[2]);
    } else {
      // not viewing a specific dashboard, reset selection
      this.selectedDefinitionIndex = -1;
    }
  }

  addDefinition() {
    // open editor with no id (new dashboard mode)
    this.router.navigate(['editor']);
  }

  removeDefinition() {

  }

  move(up: boolean) {

  }
}
