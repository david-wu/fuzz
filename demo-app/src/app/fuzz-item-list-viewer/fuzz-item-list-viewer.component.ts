import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FuzzItem } from 'fuzz-js';

@Component({
  selector: 'app-fuzz-item-list-viewer',
  templateUrl: './fuzz-item-list-viewer.component.html',
  styleUrls: ['./fuzz-item-list-viewer.component.scss']
})
export class FuzzItemListViewerComponent {

  @Input() filterSortKeys: string[];
  @Input() fuzzItems: FuzzItem[];
  @Input() selectedFuzzItem: FuzzItem;
  @Output() selectedFuzzItemChange: EventEmitter<FuzzItem> = new EventEmitter<FuzzItem>();

  constructor() { }

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
