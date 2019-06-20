import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import * as faker from 'faker';

import { Fuzz, FuzzItem } from 'fuzz-js';

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
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

  public headerTabsRight: any[] = [];
  public headerTabsLeft: any[] = [];
  public lowerTabs: any[] = [];
  public selectedLeftHeaderTab;
  public selectedRightHeaderTab;

  public fuzz = new Fuzz();
  public allItems: any[];
  public filterSortQuery = '';

  public searchKeys: string[];
  public filterSortedItems: FuzzItem[];
  public filterSortTime = 0;

  public fuzzItemsByOriginals: Map<any, FuzzItem> = new Map<any, FuzzItem>();
  public selectedOriginal: any;
  public fakeDataSize = 20;

  public allItemsString: string;
  public parseError: any;

  public isSmallScreen: boolean;

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

    this.breakpointObserver.observe([
      '(max-width: 849px)'
    ])
      .subscribe((res) => {
        this.isSmallScreen = this.mediaMatcher.matchMedia('(max-width: 849px)').matches;
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
    this.selectedRightHeaderTab = this.headerTabsRight[1];
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

  /**
   * onFilterSortQueryChange
   */
  public onFilterSortQueryChange(filterSortQuery: string) {
    this.filterSortQuery = filterSortQuery;
    this.runQuery();
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
      allItems.push(faker.helpers.userCard());
    }
    this.setAllItems(allItems);
    this.allItemsString = JSON.stringify(allItems, null, 2);
  }

  public setAllItems(allItems: any[]) {
    this.allItems = allItems;
    this.parseError = undefined;
    this.searchKeys = Fuzz.getAllKeys(allItems);
    this.runQuery();
  }

  public runQuery() {
    this.filterSortTime = Date.now();
    this.filterSortedItems = this.fuzz.search(this.allItems, this.filterSortQuery, { subjectKeys: this.searchKeys });
    this.filterSortTime = Date.now() - this.filterSortTime;

    this.fuzzItemsByOriginals = new Map<any, FuzzItem>();
    this.filterSortedItems.forEach((fuzzItem: FuzzItem) => {
      this.fuzzItemsByOriginals.set(fuzzItem.original, fuzzItem);
    });
  }

  public get selectedFuzzItem() {
    return this.fuzzItemsByOriginals && this.fuzzItemsByOriginals.get(this.selectedOriginal);
  }

}
