import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NextPassageService } from './next-passage.service';

describe('NextPassageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [ NextPassageService ]
  }));

  it('should be created', inject([HttpTestingController, NextPassageService], () => {
    const service: NextPassageService = TestBed.get(NextPassageService);
    expect(service).toBeTruthy();
  }));
});
