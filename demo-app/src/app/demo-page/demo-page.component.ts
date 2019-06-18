import { Component } from '@angular/core';
import { Fuzz, FuzzItem } from 'fuzz-js'

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
    this.filterSortedItems = this.fuzz.filterSort(this.allItems, ['title'], filterSortQuery);
    this.filterSortTime = Date.now() - this.filterSortTime;
    console.log(this.filterSortedItems)
  }

}
