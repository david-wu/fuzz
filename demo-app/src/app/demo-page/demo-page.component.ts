import { Component } from '@angular/core';
import { Fuzz, FuzzItem } from 'fuzz-js';

import { fuseData } from './fuse.json';

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent {

  public fuzz = new Fuzz();
  public allItems = fuseData;
  public filterSortQuery: string = '';
  public filterSortKeys = ['title', 'author.firstName', 'author.lastName'];
  public filterSortedItems: FuzzItem[];
  public filterSortTime: number = 0;

  /**
   * constructor
   */
  constructor() {
    this.onFilterSortQueryChange(this.filterSortQuery);
  }

  /**
   * onFilterSortQueryChange
   * @param {string} filterSortQuery
   */
  public onFilterSortQueryChange(filterSortQuery: string) {
    this.filterSortQuery = filterSortQuery;
    this.filterSortTime = Date.now();
    this.filterSortedItems = this.fuzz.filterSort(this.allItems, ['title', 'author.firstName'], filterSortQuery);
    this.filterSortTime = Date.now() - this.filterSortTime;
  }


  /**
   * get
   * remove this
   * @param {any}    item
   * @param {string} keysString
   * @param {[type]}
   */
  public get(
    item: any,
    keysString: string,
  ) {
    const keys = keysString.split('.');
    for(let i = 0; i < keys.length; i++) {
      item = item[keys[i]]
    }
    return item;
  }
}
