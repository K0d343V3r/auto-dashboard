import { TestBed } from '@angular/core/testing';

import { KioskService } from './kiosk.service';

describe('KioskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KioskService = TestBed.get(KioskService);
    expect(service).toBeTruthy();
  });
});
