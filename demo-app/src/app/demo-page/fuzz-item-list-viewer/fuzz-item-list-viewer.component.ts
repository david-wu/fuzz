import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

import { FuzzItem } from 'fuzz-js';
import { scrollIntoView } from '../../utils/scroll-into-view';

@Component({
  selector: 'app-fuzz-item-list-viewer',
  templateUrl: './fuzz-item-list-viewer.component.html',
  styleUrls: ['./fuzz-item-list-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FuzzItemListViewerComponent {

  @Input() filterSortKeys: string[];
  @Input() fuzzItems: FuzzItem[];
  @Input() selectedFuzzItem: FuzzItem;
  @Output() selectedFuzzItemChange: EventEmitter<FuzzItem> = new EventEmitter<FuzzItem>();

  @ViewChild('table', { static: true }) table;


  constructor(
    private hostEl: ElementRef,
  ) { }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.fuzzItems || changes.selectedFuzzItem) {
      // something buggy, figure out later
      // this.scrollSelectedFuzzItemIntoView();
    }

    if(changes.fuzzItems) {
      if (!this.fuzzItems.includes(this.selectedFuzzItem)) {
        this.hostEl.nativeElement.scroll(0, 0);
      }
    }
  }

  public scrollSelectedFuzzItemIntoView() {
    if (!this.table) {
      return;
    }

    const selectedRowIndex = this.fuzzItems.findIndex((fuzzItem: FuzzItem) => {
      return fuzzItem === this.selectedFuzzItem;
    });
    if (selectedRowIndex !== -1) {
      const rowEls = this.table.nativeElement.getElementsByClassName('marker-class-for-scrolling-into-view');
      if (rowEls[selectedRowIndex]) {
        scrollIntoView(this.hostEl.nativeElement, rowEls[selectedRowIndex]);
      }
    }
  }

  public selectFuzzItem(fuzzItem: FuzzItem) {
    this.selectedFuzzItem = (this.selectedFuzzItem === fuzzItem) ? undefined : fuzzItem;
    this.selectedFuzzItemChange.emit(this.selectedFuzzItem);
  }

  /**
   * remove this someday
   */
  public get(
    item: any,
    keysString: string,
  ) {
    const keys = keysString.split('.');
    for (let i = 0; i < keys.length; i++) {
      if (!item) {
        return '';
      }
      item = item[keys[i]];
    }
    return item;
  }

}
