import { TestBed } from '@angular/core/testing';

import { DefinitionResolverService } from './definition-resolver.service';

describe('DashboardResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefinitionResolverService = TestBed.get(DefinitionResolverService);
    expect(service).toBeTruthy();
  });
});
