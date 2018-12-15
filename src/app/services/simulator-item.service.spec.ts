import { TestBed } from '@angular/core/testing';

import { SimulatorItemService } from './simulator-item.service';

describe('SimulatorItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimulatorItemService = TestBed.get(SimulatorItemService);
    expect(service).toBeTruthy();
  });
});
