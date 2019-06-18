import { Component, OnInit } from '@angular/core';
import { Fuzz, FuzzItem } from 'fuzz-js'
import fuseData from './fuse.json';

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.css']
})
export class DemoPageComponent implements OnInit {

  public fuzz = new Fuzz();
  public allItems = fuseData;
  public filterSortQuery: string = '';
  public filterSortedItems: FuzzItem[];

  constructor() {
    this.filterSortedItems = this.onFilterSortQueryChange(this.filterSortQuery)
  }

  public onFilterSortQueryChange(filterSortQuery: string) {
    this.filterSortQuery = filterSortQuery;
    this.filterSortedItems = this.fuzz.filterSort(this.allItems, ['title'], filterSortQuery);
  }

}
