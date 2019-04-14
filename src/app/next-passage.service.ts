import { Stop } from './stop';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, timer, merge } from 'rxjs';
import { switchMap, publishReplay, refCount, debounceTime } from 'rxjs/operators';

interface PassageStopResponse {
  route: string;
  stop: string;
  passages: Array<string>;
}

interface PassageStopRequest {
  trips: Array<Stop>;
}

@Injectable({
  providedIn: 'root'
})
export class NextPassageService {
  private observedStops: Array<Stop> = [];
  private trigger = new Subject<void>();
  private url = 'https://us-central1-nextpassage-df18d.cloudfunctions.net/api';
  private allPassages: Observable<Array<PassageStopResponse>> = null;

  constructor(private http: HttpClient) {
    this.allPassages = merge(
      timer(60000, 60000),
      this.trigger
    ).pipe(
      debounceTime(200),
      switchMap(() => this.getAllPassages()),
      publishReplay(1),
      refCount()
    );
  }

  public getNextPassages(stop: Stop): Observable<number | null> {
    return Observable.create((observer) => {
      this.observedStops.push(stop);
      const subscription = this.allPassages.subscribe((allPassages) => {
        console.log('received new values');
        let passages = [];
        allPassages.some((passage) => {
          if (passage.route === stop.routeId && passage.stop === stop.stopId) {
            if (passage.passages) {
              passages = passage.passages;
            }
            return true;
          }
          return false;
        });
        const next = passages.filter((x) => x > Date.now() / 1000).sort();
        if (next.length === 0) {
          observer.next(null);
        }
        observer.next(next[0]);
      });
      this.trigger.next();
      return () => {
        const idx = this.observedStops.findIndex((value) => value.routeId === stop.routeId && value.stopId === stop.stopId);
        this.observedStops.splice(idx, 1);
        subscription.unsubscribe();
      };
    });
  }

  private getAllPassages(): Observable<Array<PassageStopResponse>> {
    const allStops = {
      trips: this.observedStops.map((stop) => {
        return { route: stop.routeId, stop: stop.stopId };
      })
    };
    return this.http.post<PassageStopResponse[]>(this.url + '/nextPassages', allStops);
  }
}
