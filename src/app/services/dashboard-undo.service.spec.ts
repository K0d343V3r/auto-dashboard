import { TestBed } from '@angular/core/testing';

import { DashboardUndoService } from './dashboard-undo.service';

describe('DashboardUndoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardUndoService = TestBed.get(DashboardUndoService);
    expect(service).toBeTruthy();
  });
});
