import { Stop } from './stop';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { switchMap, publish, refCount, debounceTime, tap } from 'rxjs/operators';

interface StopDepartureResponse {
  route: string;
  stop: string;
  passages: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class NextDepartureService {
  private observedStops: Array<Stop> = [];
  private trigger = new Subject<void>();
  private url = 'https://us-central1-nextpassage-df18d.cloudfunctions.net/api';
  private allDepartures: Observable<Array<StopDepartureResponse>> = null;
  private nextTriggerTimer: any;

  constructor(private http: HttpClient) {
    this.allDepartures = this.trigger.pipe(
      debounceTime(200),
      switchMap(() => this.getAllDepartures()),
      tap((x) => this.newStopDepartures(x)),
      publish(),
      refCount()
    );
  }

  private newStopDepartures(allStopDepartures: Array<StopDepartureResponse>): void {
    let allDepartureTimes = [];
    allStopDepartures.forEach((stopDeparture: StopDepartureResponse) => {
      if (stopDeparture.passages) {
        allDepartureTimes = allDepartureTimes.concat(stopDeparture.passages);
      }
    });
    const now = Math.floor(Date.now() / 1000);
    const minDeparture = allDepartureTimes.filter((x) => x > now).sort()[0] - now;
    let nextTrigger: number;
    if (!minDeparture) {
      nextTrigger = 600;
    } else if (minDeparture > 600) {
      nextTrigger = Math.max(Math.min(minDeparture - 600, 600), 60);
    } else {
      nextTrigger = 60;
    }
    if (this.nextTriggerTimer) {
      clearTimeout(this.nextTriggerTimer);
      this.nextTriggerTimer = null;
    }
    this.nextTriggerTimer = setTimeout(() => { this.trigger.next(); }, nextTrigger * 1000);
  }

  public getNextDepartures(stop: Stop): Observable<Array<number> | null> {
    return Observable.create((observer) => {
      this.observedStops.push(stop);
      const subscription = this.allDepartures.subscribe((allDepartures) => {
        console.log('received new values');
        let departures = [];
        allDepartures.some((departure) => {
          if (departure.route === stop.routeId && departure.stop === stop.stopId) {
            if (departure.passages) {
              departures = departure.passages;
            }
            return true;
          }
          return false;
        });
        observer.next(departures);
      });
      this.trigger.next();
      return () => {
        const idx = this.observedStops.findIndex((value) => value.routeId === stop.routeId && value.stopId === stop.stopId);
        this.observedStops.splice(idx, 1);
        if (this.observedStops.length === 0) {
          clearTimeout(this.nextTriggerTimer);
          this.nextTriggerTimer = null;
        }
        subscription.unsubscribe();
      };
    });
  }

  private getAllDepartures(): Observable<Array<StopDepartureResponse>> {
    const allStops = {
      trips: this.observedStops.map((stop) => {
        return { route: stop.routeId, stop: stop.stopId };
      })
    };
    return this.http.post<StopDepartureResponse[]>(this.url + '/nextPassages', allStops);
  }
}
