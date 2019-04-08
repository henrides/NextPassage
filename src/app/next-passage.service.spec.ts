import { TestBed } from '@angular/core/testing';

import { NextPassageService } from './next-passage.service';

describe('NextPassageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NextPassageService = TestBed.get(NextPassageService);
    expect(service).toBeTruthy();
  });
});
