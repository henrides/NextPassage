import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopPassageComponent } from './stop-passage.component';

describe('StopPassageComponent', () => {
  let component: StopPassageComponent;
  let fixture: ComponentFixture<StopPassageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopPassageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopPassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
