import { TestBed } from '@angular/core/testing';

import { SimulatorTagService } from './simulator-tag.service';

describe('SimulatorTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimulatorTagService = TestBed.get(SimulatorTagService);
    expect(service).toBeTruthy();
  });
});
