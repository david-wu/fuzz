import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { FuzzItem, Fuzzalytics } from 'fuzz-js';

@Component({
  selector: 'app-fuzzalytics',
  templateUrl: './fuzzalytics.component.html',
  styleUrls: ['./fuzzalytics.component.scss']
})
export class FuzzalyticsComponent implements OnChanges {

  @Input() fuzzItem: FuzzItem;
  @Input() fuzzalyticsByFuzzItem: WeakMap<FuzzItem, Fuzzalytics>;

  public fuzzalytics: Fuzzalytics;
  public subjectArr: string[];
  public queryArr: string[];

  public traversedCellsIndex: any = [];

  constructor() {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.fuzzItem || changes.fuzzalyticsByFuzzItem) {
      this.fuzzalytics = this.fuzzalyticsByFuzzItem ? this.fuzzalyticsByFuzzItem.get(this.fuzzItem) : undefined;
      this.subjectArr = this.fuzzItem.subject.split('');
      this.subjectArr.unshift(' ');
      this.subjectArr.unshift(' ');

      this.queryArr = this.fuzzItem.query.split('');
      this.queryArr.unshift(' ');
      this.queryArr.unshift(' ');

      this.traversedCellsIndex = [];
      this.fuzzalytics.traversedCells.forEach((cell: number[]) => {
        this.traversedCellsIndex[cell[0]] = this.traversedCellsIndex[cell[0]] || [];
        this.traversedCellsIndex[cell[0]][cell[1]] = true;
      })
    }
  }

}
