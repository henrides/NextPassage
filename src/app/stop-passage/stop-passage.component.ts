import { Stop } from './../stop';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NextDepartureService } from '../next-departure.service';
import { Subject, timer, merge } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-stop-passage',
  templateUrl: './stop-passage.component.html',
  styleUrls: ['./stop-passage.component.scss']
})
export class StopPassageComponent implements OnInit, OnDestroy {
  @Input() stop: Stop;
  public nextDepartures: Array<number> | null;
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(private nextDepartureService: NextDepartureService) { }

  ngOnInit() {
    merge(
      this.nextDepartureService.getNextDepartures(this.stop),
      timer(20000, 20000).pipe(
        map(() => this.nextDepartures)
      )
    ).pipe(
      takeUntil(this.destroy)
    ).subscribe((departures: Array<number> | null) => {
      if (departures) {
        this.nextDepartures = departures.filter((x) => x > Date.now() / 1000).sort();
      } else {
        this.nextDepartures = null;
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  public get nextDeparture(): number | null {
    if (!this.nextDepartures || this.nextDepartures.length === 0) {
      return null;
    }
    return this.nextDepartures[0];
  }

}
