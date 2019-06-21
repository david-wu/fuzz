import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsAndCodeComponent } from './options-and-code.component';

describe('OptionsAndCodeComponent', () => {
  let component: OptionsAndCodeComponent;
  let fixture: ComponentFixture<OptionsAndCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsAndCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsAndCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
