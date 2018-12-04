import { TestBed } from '@angular/core/testing';

import { ElementsResolverService } from './elements-resolver.service';

describe('DashboardsResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ElementsResolverService = TestBed.get(ElementsResolverService);
    expect(service).toBeTruthy();
  });
});
