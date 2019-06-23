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
  public worstPossibleEditDistance: number;

  public viewOps = true;

  public legendScores = [1, 0.75, 0.5, 0.25, 0];
  public legendScoreColors: string[];

  constructor() {
    this.legendScoreColors = this.legendScores.map((legendScore) => this.getColorByScore(legendScore));
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
      });

      this.worstPossibleEditDistance = this.fuzzalytics.worstPossibleEditDistance;
    }
  }

  public getColorByEditDistance(editDistance, worstPossible = this.worstPossibleEditDistance) {
    const score = 1 - (editDistance / worstPossible)
    return this.getColorByScore(score);
  }

  public getColorByScore(score: number) {
    const normalizedScore = Math.round(score * 255);
    const oppositeScore = 255 - normalizedScore;

    const normalizedHex = normalizedScore.toString(16).padStart(2, '0');
    const oppositeHex = oppositeScore.toString(16).padStart(2, '0');
    return `#${oppositeHex}${normalizedHex}88`;
  }

}
