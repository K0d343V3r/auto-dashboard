import { TestBed } from '@angular/core/testing';

import { DefaultColorService } from './default-color.service';

describe('DefaultColorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefaultColorService = TestBed.get(DefaultColorService);
    expect(service).toBeTruthy();
  });
});
