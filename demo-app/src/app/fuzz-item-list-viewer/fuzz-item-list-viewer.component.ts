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
  @Input() selectedOriginalItem: any;
  @Output() selectedOriginalItemChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public selectOriginalItem(original: any) {
    this.selectedOriginalItem = (this.selectedOriginalItem === original) ? undefined : original;
    this.selectedOriginalItemChange.emit(this.selectedOriginalItem);
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
