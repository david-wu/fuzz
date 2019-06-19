import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Fuzz, FuzzItem, FuzzDebugger } from 'fuzz-js';

import { fuseData } from './fuse.js';

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent implements AfterViewInit {

  @ViewChild('fuzzSearchTab') fuzzSearchTab;
  @ViewChild('fuzzSearchPage') fuzzSearchPage;
  @ViewChild('fuseDataTab') fuseDataTab;
  @ViewChild('fuseDataPage') fuseDataPage;
  @ViewChild('fuzzItemDebuggerTab') fuzzItemDebuggerTab;
  @ViewChild('fuzzItemDebuggerPage') fuzzItemDebuggerPage;
  @ViewChild('fuzzSearchOptionsTab') fuzzSearchOptionsTab;
  @ViewChild('fuzzSearchOptionsPage') fuzzSearchOptionsPage;
  @ViewChild('fuzzSearchResultsTab') fuzzSearchResultsTab;
  @ViewChild('fuzzSearchResultsPage') fuzzSearchResultsPage;

  public headerTabsRight: any[] = [];
  public headerTabsLeft: any[] = [];
  public selectedRightHeaderTab;

  public fuzz = new Fuzz();
  public allItems = fuseData;
  public filterSortQuery = '';

  public filterSortKeys: string[] = Fuzz.getAllKeys(this.allItems);
  public filterSortedItems: FuzzItem[];
  public filterSortTime = 0;

  public selectedFuzzItem: FuzzItem;

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
        tabTemplate: this.fuzzSearchResultsTab,
        pageTemplate: this.fuzzSearchResultsPage,
      },
      {
        tabTemplate: this.fuzzItemDebuggerTab,
        pageTemplate: this.fuzzItemDebuggerPage,
      },
    ];
    this.selectedRightHeaderTab = this.headerTabsRight[1];
    this.changeDetectorRef.detectChanges();
  }

  /**
   * onFilterSortQueryChange
   */
  public onFilterSortQueryChange(filterSortQuery: string) {
    this.filterSortQuery = filterSortQuery;
    this.filterSortTime = Date.now();
    this.filterSortedItems = this.fuzz.filterSort(this.allItems, filterSortQuery, this.filterSortKeys);
    this.filterSortTime = Date.now() - this.filterSortTime;
    this.selectedFuzzItem = undefined;
  }

  public selectFuzzItem(fuzzItem: FuzzItem) {
    this.selectedFuzzItem = (this.selectedFuzzItem === fuzzItem) ? undefined : fuzzItem;
  }

  /**
   * get
   * remove this
   */
  public get(
    item: any,
    keysString: string,
  ) {
    const keys = keysString.split('.');
    for (let i = 0; i < keys.length; i++) {
      item = item[keys[i]];
    }
    return item;
  }
}
