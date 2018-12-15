import { Component, OnInit, Input } from '@angular/core';
import { IDocumentControl } from '../i-dashboard-control';
import { SimulatorDocument } from 'src/app/proxies/data-simulator-api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit, IDocumentControl {
  @Input() item: SimulatorDocument;
  value: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  resize() {
  }

  set data(value: string) {
    this.value = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
