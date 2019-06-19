import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Fuzz, FuzzItem } from 'fuzz-js';

import { fuseData } from './fuse.js';

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent {

  @ViewChild('fuzzSearchTab') fuzzSearchTab;
  @ViewChild('fuzzSearchPage') fuzzSearchPage;
  @ViewChild('fuseDataTab') fuseDataTab;
  @ViewChild('fuseDataPage') fuseDataPage;

  public headerTabs: any[] = [];
  public headerTabsLeft = [];

  public fuzz = new Fuzz();
  public allItems = fuseData;
  public filterSortQuery: string = '';
  public filterSortKeys = ['title', 'author.firstName', 'author.lastName'];
  public filterSortedItems: FuzzItem[];
  public filterSortTime: number = 0;


  /**
   * constructor
   */
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.onFilterSortQueryChange(this.filterSortQuery);
  }

  public ngAfterViewInit() {
    this.headerTabsLeft = [
      {
        tabTemplate: this.fuzzSearchTab,
        pageTemplate: this.fuzzSearchPage,
      },
      {
        tabTemplate: this.fuseDataTab,
        pageTemplate: this.fuseDataPage,
      }
    ];
    this.changeDetectorRef.detectChanges();
  }

  /**
   * onFilterSortQueryChange
   * @param {string} filterSortQuery
   */
  public onFilterSortQueryChange(filterSortQuery: string) {
    this.filterSortQuery = filterSortQuery;
    this.filterSortTime = Date.now();
    this.filterSortedItems = this.fuzz.filterSort(this.allItems, this.filterSortKeys, filterSortQuery);
    this.filterSortTime = Date.now() - this.filterSortTime;
    console.log(this.filterSortedItems);
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
