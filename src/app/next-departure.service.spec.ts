import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NextDepartureService } from './next-departure.service';
import { take } from 'rxjs/operators';

describe('NextDepartureService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [ NextDepartureService ]
  }));

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created',
    inject([HttpTestingController, NextDepartureService],
      (httpMock: HttpTestingController, service: NextDepartureService) => {
        expect(service).toBeTruthy();
      }
    )
  );

  it('should fetch new departures for one stop',
    inject([HttpTestingController, NextDepartureService],
      fakeAsync((httpMock: HttpTestingController, service: NextDepartureService) => {
        const nextDepartureTime = (Date.now() / 1000) + 1234;
        service.getNextDepartures({ routeId: '1', stopId: '1234' }).pipe(
          take(1)
        ).subscribe((departure) => {
          expect(departure).toBe(nextDepartureTime);
        });

        tick(300); // debounce

        const req = httpMock.expectOne('https://us-central1-nextpassage-df18d.cloudfunctions.net/api/nextPassages');
        expect(req.request.method).toEqual('POST');

        const data = [
          {
            route: '1',
            stop: '1234',
            passages: [nextDepartureTime]
          }
        ];
        req.flush(data);
      }
    ))
  );
});
