import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopPassageListComponent } from './stop-passage-list.component';

describe('StopPassageListComponent', () => {
  let component: StopPassageListComponent;
  let fixture: ComponentFixture<StopPassageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopPassageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopPassageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
