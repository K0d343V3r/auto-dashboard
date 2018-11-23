import { TestBed } from '@angular/core/testing';

import { ActiveDashboardService } from './active-dashboard.service';

describe('ActiveDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveDashboardService = TestBed.get(ActiveDashboardService);
    expect(service).toBeTruthy();
  });
});
