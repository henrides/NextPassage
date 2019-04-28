import { FromNowPipe } from './../from-now.pipe';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopPassageComponent } from './stop-passage.component';
import { NextDepartureService } from '../next-departure.service';
import { of } from 'rxjs';

let nextPassageServiceStub: Partial<NextDepartureService>;

nextPassageServiceStub = {
  getNextDepartures: () => {
    return of(null);
  }
};

describe('StopPassageComponent', () => {
  let component: StopPassageComponent;
  let fixture: ComponentFixture<StopPassageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StopPassageComponent,
        FromNowPipe
      ],
      providers: [
        { provide: NextDepartureService, useValue: nextPassageServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopPassageComponent);
    component = fixture.componentInstance;
    component.stop = { routeId: '73', stopId: '12345' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
