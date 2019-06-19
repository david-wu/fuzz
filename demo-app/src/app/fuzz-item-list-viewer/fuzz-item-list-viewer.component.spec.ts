import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuzzItemListViewerComponent } from './fuzz-item-list-viewer.component';

describe('FuzzItemListViewerComponent', () => {
  let component: FuzzItemListViewerComponent;
  let fixture: ComponentFixture<FuzzItemListViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuzzItemListViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuzzItemListViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
