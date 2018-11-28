import { TestBed } from '@angular/core/testing';

import { LayoutSchemeService } from './layout-scheme.service';

describe('LayoutSchemeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LayoutSchemeService = TestBed.get(LayoutSchemeService);
    expect(service).toBeTruthy();
  });
});
