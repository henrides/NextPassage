import { Stop } from './stop';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, timer, ReplaySubject, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, publish, publishReplay, refCount, map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) { }

  public getNextPassages(stop: Stop): Observable<number | null> {
    return Observable.create((observer) => {
      this.observedStops.push(stop);
      const subscription = this.allPassages().subscribe((allPassages) => {
        console.log('received new values');
        let passages = [];
        allPassages.some((passage) => {
          if (passage.route === stop.routeId && passage.stop === stop.stopId) {
            passages = passage.passages;
            return true;
          }
          return false;
        });
        if (passages.length === 0) {
          observer.next(null);
        }
        observer.next(passages.sort()[0]);
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

  private allPassages(): Observable<Array<PassageStopResponse>> {
    return merge(
      timer(60000, 60000),
      this.trigger
    ).pipe(
      switchMap(() => this.getAllPassages()),
      publishReplay(1),
      refCount()
    );
  }
}
