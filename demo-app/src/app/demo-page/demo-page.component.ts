import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import * as faker from 'faker';
import * as Fuse from 'fuse.js';

import { Fuzz, FuzzItem } from 'fuzz-js';

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: [
    './demo-page.component.scss',
    '../styles/text-area-container.scss',
  ]
})
export class DemoPageComponent implements AfterViewInit {

  @ViewChild('fuzzSearchTab', { static: true }) fuzzSearchTab;
  @ViewChild('fuzzSearchPage', { static: true }) fuzzSearchPage;
  @ViewChild('fuzzDataTab', { static: true }) fuzzDataTab;
  @ViewChild('fuzzDataPage', { static: true }) fuzzDataPage;
  @ViewChild('fuzzItemDebuggerTab', { static: true }) fuzzItemDebuggerTab;
  @ViewChild('fuzzItemDebuggerPage', { static: true }) fuzzItemDebuggerPage;
  @ViewChild('fuzzSearchOptionsTab', { static: true }) fuzzSearchOptionsTab;
  @ViewChild('fuzzSearchOptionsPage', { static: true }) fuzzSearchOptionsPage;
  @ViewChild('fuzzSearchResultsTab', { static: true }) fuzzSearchResultsTab;
  @ViewChild('fuzzSearchResultsPage', { static: true }) fuzzSearchResultsPage;
  @ViewChild('fuzzalyticsTab', { static: true }) fuzzalyticsTab;
  @ViewChild('fuzzalyticsPage', { static: true }) fuzzalyticsPage;

  @ViewChild('fuseJsSearchTab', { static: true }) fuseJsSearchTab;
  @ViewChild('fuseJsSearchPage', { static: true }) fuseJsSearchPage;

  public headerTabsRight: any[] = [];
  public headerTabsLeft: any[] = [];
  public lowerTabs: any[] = [];
  public selectedLeftHeaderTab;
  public selectedRightHeaderTab;

  public fuzz = new Fuzz();
  public allItems: any[];
  public filterSortQuery = '';

  public filterSortedItems: FuzzItem[];
  public filterSortTime = 0;

  public selectedFuzzItem: FuzzItem;
  public fakeDataSize = 30;

  public allItemsString: string;
  public parseError: any;

  public isSmallScreen: boolean;
  public searchOptions: Partial<Fuzz> = {};

  public fuseJsFilterQuery: string = '';
  public fuseJsFilterItems: any[];
  public fuseJsFilterSortTime: number;

  /**
   * constructor
   */
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public breakpointObserver: BreakpointObserver,
    public mediaMatcher: MediaMatcher,
  ) {
    this.generateFakeData();
    this.onFilterSortQueryChange(this.filterSortQuery);

    // This should actually use ResizeSensor
    // breakpointObserver uses the browser-window max-width, not hostElement's width
    this.breakpointObserver.observe([
      '(max-width: 949px)'
    ])
      .subscribe((res) => {
        this.isSmallScreen = this.mediaMatcher.matchMedia('(max-width: 949px)').matches;
      });
  }

  public ngAfterViewInit() {
    this.headerTabsLeft = [
      {
        tabTemplate: this.fuzzSearchOptionsTab,
        pageTemplate: this.fuzzSearchOptionsPage,
      },
      {
        tabTemplate: this.fuzzSearchTab,
        pageTemplate: this.fuzzSearchPage,
      },
      // {
      //   tabTemplate: this.fuseJsSearchTab,
      //   pageTemplate: this.fuseJsSearchPage,
      // },
    ];
    this.selectedLeftHeaderTab = this.headerTabsLeft[1];
    this.headerTabsRight = [
      {
        tabTemplate: this.fuzzDataTab,
        pageTemplate: this.fuzzDataPage,
      },
      {
        tabTemplate: this.fuzzSearchResultsTab,
        pageTemplate: this.fuzzSearchResultsPage,
      },
    ];
    this.selectedRightHeaderTab = this.headerTabsRight[0];
    this.lowerTabs = [
      {
        tabTemplate: this.fuzzItemDebuggerTab,
        pageTemplate: this.fuzzItemDebuggerPage,
      },
      {
        tabTemplate: this.fuzzalyticsTab,
        pageTemplate: this.fuzzalyticsPage,
      },
    ];
    this.changeDetectorRef.detectChanges();
  }

  public onSearchOptionsChange(searchOptions) {
    this.searchOptions = {
      ...this.searchOptions,
      ...searchOptions,
    };
    this.runQuery();
  }

  /**
   * onFilterSortQueryChange
   */
  public onFilterSortQueryChange(filterSortQuery: string) {
    this.filterSortQuery = filterSortQuery;
    this.runQuery();
    // this.runFuseQuery();
  }

  public allItemsStringChange(allItemsString: string) {
    this.allItemsString = allItemsString;
    try {
      this.setAllItems(JSON.parse(allItemsString));
    } catch (error) {
      this.parseError = error;
    }
  }

  public generateFakeData() {
    const allItems = [];
    for (let i = 0; i < this.fakeDataSize; i++) {
      const siblingCount = Math.floor(Math.random() * 3);
      const siblings = []
      for (let j = 0; j <= siblingCount; j++) {
        siblings.push(faker.name.findName());
      }
      allItems.push({
        name: faker.name.findName(),
        siblings,
      });
    }
    this.setAllItems(allItems);
    this.allItemsString = JSON.stringify(allItems, null, 2);
  }

  public generateFlatFakeData() {
    const allItems = [];
    for (let i = 0; i < this.fakeDataSize; i++) {
      allItems.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        city: faker.address.city(),
      });
    }
    this.setAllItems(allItems);
    this.allItemsString = JSON.stringify(allItems, null, 2);
  }

  public setAllItems(allItems: any[]) {
    this.allItems = allItems;
    this.parseError = undefined;
    this.searchOptions = {
      ...this.searchOptions,
      subjectKeys: Fuzz.getAllKeys(allItems),
    };
    this.runQuery();
    // this.runFuseQuery();
  }

  public runQuery() {
    this.filterSortTime = Date.now();
    this.filterSortedItems = this.fuzz.search(this.allItems, this.filterSortQuery, this.searchOptions);
    this.filterSortTime = Date.now() - this.filterSortTime;
  }

  // if the selected fuzz item is no longer returned in the filter results
  // this will still grab it from the index in Fuzz.diagnostics (using object ref of original)
  public get freshestFuzzItem() {
    if (!this.selectedFuzzItem) {
      return;
    }
    return this.fuzz.diagnostics.allFuzzItemsByKeyByOriginal
      .get(this.selectedFuzzItem.original)[this.selectedFuzzItem.key];
  }

  // public runFuseQuery() {
  //   this.fuseJsFilterSortTime = Date.now();
  //   var fuse = new Fuse(this.allItems, {
  //     keys: this.searchOptions.subjectKeys,
  //     includeScore: true,
  //   });
  //   this.fuseJsFilterItems = fuse.search(this.filterSortQuery)
  //     .map((fuseJsFilterItem: any) => {
  //       return {
  //         ...fuseJsFilterItem,
  //         original: fuseJsFilterItem.item,
  //       };
  //     });
  //   this.fuseJsFilterSortTime = Date.now() - this.fuseJsFilterSortTime;
  // }

}
