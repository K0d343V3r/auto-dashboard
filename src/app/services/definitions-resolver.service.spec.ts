import { TestBed } from '@angular/core/testing';

import { DefinitionsResolverService } from './definitions-resolver.service';

describe('DashboardsResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefinitionsResolverService = TestBed.get(DefinitionsResolverService);
    expect(service).toBeTruthy();
  });
});
