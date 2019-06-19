import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Fuzz, FuzzItem, FuzzDebugger } from 'fuzz-js';

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
  @ViewChild('fuzzItemDebuggerTab') fuzzItemDebuggerTab;
  @ViewChild('fuzzItemDebuggerPage') fuzzItemDebuggerPage;
  @ViewChild('fuzzSearchOptionsTab') fuzzSearchOptionsTab;
  @ViewChild('fuzzSearchOptionsPage') fuzzSearchOptionsPage;

  public headerTabs: any[] = [];
  public headerTabsLeft = [];

  public fuzz = new Fuzz();
  public allItems = fuseData;
  public filterSortQuery: string = '';

  public filterSortKeys = Fuzz.getAllKeys(this.allItems);
  public filterSortedItems: FuzzItem[];
  public filterSortTime: number = 0;

  public selectedFuzzItem: FuzzItem;
  public selectedFuzzDebug: string = '';


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
        tabTemplate: this.fuzzSearchOptionsTab,
        pageTemplate: this.fuzzSearchOptionsPage,
      },
    ];
    this.headerTabsRight = [
      {
        tabTemplate: this.fuseDataTab,
        pageTemplate: this.fuseDataPage,
      },
      {
        tabTemplate: this.fuzzItemDebuggerTab,
        pageTemplate: this.fuzzItemDebuggerPage,
      },
    ];
    this.selectedRightHeaderTab =this.headerTabsRight[0];
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


  public selectFuzzItem(fuzzItem: FuzzItem) {
    if (fuzzItem === this.selectedFuzzItem) {
      this.selectedFuzzItem = undefined;
      this.selectedFuzzDebug = '';
      this.selectedRightHeaderTab = this.headerTabsRight[0];
      return;
    }
    this.selectedFuzzItem = fuzzItem;
    const fd = new FuzzDebugger();
    this.selectedFuzzDebug = fd.debugFuzzItem(fuzzItem);
    this.selectedRightHeaderTab = this.headerTabsRight[1];
    console.log('selected', fuzzItem, this.selectedFuzzDebug)
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
