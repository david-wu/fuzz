import { FuzzItem } from './models/index';

interface FuzzItemByKey {
	[key: string]: FuzzItem,
};

export interface Fuzzalytics {
  editMatrix: number[][],
  operationMatrix: number[][],
  traversedCells: number[][],
  worstPossibleEditDistance: number,
}

export class FuzzDiagnostics {

  public allFuzzItemsByKeyByOriginal: WeakMap<any, FuzzItemByKey> = new WeakMap<any, FuzzItemByKey>();
  public fuzzalyticsByFuzzItem: WeakMap<FuzzItem, Fuzzalytics> = new WeakMap<FuzzItem, Fuzzalytics>();


  public indexFuzzItems(fuzzItems: FuzzItem[]) {
    fuzzItems.forEach((fuzzItem: FuzzItem) => {
      let fuzzItemsByKey = this.allFuzzItemsByKeyByOriginal.get(fuzzItem.original);
      if (!fuzzItemsByKey) {
        fuzzItemsByKey = {};
      }
      fuzzItemsByKey[fuzzItem.key] = fuzzItem;
      this.allFuzzItemsByKeyByOriginal.set(fuzzItem.original, fuzzItemsByKey);
    });
  }

  public setFuzzalyticsForFuzzItem(fuzzItem: FuzzItem, fuzzalytics: Fuzzalytics) {
	  this.fuzzalyticsByFuzzItem.set(fuzzItem, fuzzalytics);
  }


}