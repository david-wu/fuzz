import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuzzalyticsComponent } from './fuzzalytics.component';

describe('FuzzalyticsComponent', () => {
  let component: FuzzalyticsComponent;
  let fixture: ComponentFixture<FuzzalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuzzalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuzzalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
