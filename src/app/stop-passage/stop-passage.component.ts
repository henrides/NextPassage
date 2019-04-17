import { Stop } from './../stop';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NextPassageService } from '../next-passage.service';
import { Subject, timer, merge } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-stop-passage',
  templateUrl: './stop-passage.component.html',
  styleUrls: ['./stop-passage.component.scss']
})
export class StopPassageComponent implements OnInit, OnDestroy {
  @Input() stop: Stop;
  public nextPassage: number | null;
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(private nextPassageService: NextPassageService) { }

  ngOnInit() {
    merge(
      this.nextPassageService.getNextPassages(this.stop),
      timer(20000, 20000).pipe(
        map(() => this.nextPassage)
      )
    ).pipe(
      takeUntil(this.destroy)
    ).subscribe((value) => {
      console.log('new value for stop ' + this.stop.routeId + '(' + this.stop.stopId + '):' + value);
      this.nextPassage = value;
    });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

}
