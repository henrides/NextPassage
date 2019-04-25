import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { StopPassageListComponent } from './stop-passage-list.component';

@Component({selector: 'app-stop-passage', template: ''})
class StopPassageStubComponent {
  @Input() stop;
}

describe('StopPassageListComponent', () => {
  let component: StopPassageListComponent;
  let fixture: ComponentFixture<StopPassageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StopPassageListComponent,
        StopPassageStubComponent
      ]
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
