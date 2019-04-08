import { Stop } from './../stop';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NextPassageService } from '../next-passage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-stop-passage',
  templateUrl: './stop-passage.component.html',
  styleUrls: ['./stop-passage.component.scss']
})
export class StopPassageComponent implements OnInit, OnDestroy {
  @Input() stop: Stop;
  public nextPassage: number | null;
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(private nextPasageService: NextPassageService) { }

  ngOnInit() {
    this.nextPasageService.getNextPassages(this.stop).pipe(
      takeUntil(this.destroy)
    ).subscribe((value) => {
      this.nextPassage = value;
    });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

}
