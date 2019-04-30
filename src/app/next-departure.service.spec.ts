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
        ).subscribe((departures) => {
          expect(departures[0]).toBe(nextDepartureTime);
        });

        tick(300); // debounce

        const req = httpMock.expectOne(request => request.url.endsWith('/nextPassages') && request.method === 'POST');

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

  it('should only trigger one fetch for 2 stops added at the same time',
    inject([HttpTestingController, NextDepartureService],
      fakeAsync((httpMock: HttpTestingController, service: NextDepartureService) => {
        const nextDepartureTime = (Date.now() / 1000) + 1234;
        service.getNextDepartures({ routeId: '1', stopId: '1234' }).pipe(
          take(1)
        ).subscribe((departures) => {
          expect(departures[0]).toBe(nextDepartureTime);
        });

        service.getNextDepartures({ routeId: '2', stopId: '1234' }).pipe(
          take(1)
        ).subscribe((departures) => {
          expect(departures[0]).toBe(nextDepartureTime + 1);
        });

        tick(300); // debounce

        const req = httpMock.expectOne(request => request.url.endsWith('/nextPassages') && request.method === 'POST');

        const data = [
          {
            route: '1',
            stop: '1234',
            passages: [nextDepartureTime]
          },
          {
            route: '2',
            stop: '1234',
            passages: [nextDepartureTime + 1]
          },
        ];
        req.flush(data);
      }
    ))
  );

  it('should trigger two fetch for 2 stops added not at the same time',
    inject([HttpTestingController, NextDepartureService],
      fakeAsync((httpMock: HttpTestingController, service: NextDepartureService) => {
        const nextDepartureTime = Math.round((Date.now() / 1000)) + 1234;
        service.getNextDepartures({ routeId: '1', stopId: '1234' }).pipe(
          take(2)
        ).subscribe((departures) => {
          expect(departures[0]).toBe(nextDepartureTime);
        });

        tick(1000);

        const req1 = httpMock.match(request => request.url.endsWith('/nextPassages') && request.method === 'POST');
        expect(req1.length).toBe(1);

        const data1 = [
          {
            route: '1',
            stop: '1234',
            passages: [nextDepartureTime]
          }
        ];
        req1[0].flush(data1);

        service.getNextDepartures({ routeId: '2', stopId: '1234' }).pipe(
          take(1)
        ).subscribe((departures) => {
          expect(departures[0]).toBe(nextDepartureTime + 1);
        });

        tick(1000);

        const req2 = httpMock.match(request => request.url.endsWith('/nextPassages') && request.method === 'POST');
        expect(req2.length).toBe(1);

        const data2 = [
          {
            route: '1',
            stop: '1234',
            passages: [nextDepartureTime]
          },
          {
            route: '2',
            stop: '1234',
            passages: [nextDepartureTime + 1]
          },
        ];
        req2[0].flush(data2);
      }
    ))
  );

  it('should trigger every minutes if next passage in less than 10 minutes',
    inject([HttpTestingController, NextDepartureService],
      fakeAsync((httpMock: HttpTestingController, service: NextDepartureService) => {
        const nextDepartureTime = Math.round((Date.now() / 1000)) + 300;
        service.getNextDepartures({ routeId: '1', stopId: '1234' }).pipe(
          take(3)
        ).subscribe((departures) => {
          expect(departures[0]).toBe(nextDepartureTime);
        });

        tick(300);

        let req = httpMock.expectOne(request => request.url.endsWith('/nextPassages') && request.method === 'POST');
        const data = [
          {
            route: '1',
            stop: '1234',
            passages: [nextDepartureTime]
          }
        ];
        req.flush(data);

        tick(60000);
        tick(300);
        req = httpMock.expectOne(request => request.url.endsWith('/nextPassages') && request.method === 'POST');
        req.flush(data);

        tick(60000);
        tick(300);
        req = httpMock.expectOne(request => request.url.endsWith('/nextPassages') && request.method === 'POST');
        req.flush(data);
      }
    ))
  );
});
