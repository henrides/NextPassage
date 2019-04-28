import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NextDepartureService } from './next-departure.service';

describe('NextDepartureService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [ NextDepartureService ]
  }));

  it('should be created', inject([HttpTestingController, NextDepartureService], () => {
    const service: NextDepartureService = TestBed.get(NextDepartureService);
    expect(service).toBeTruthy();
  }));
});
