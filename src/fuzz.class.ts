import { EditCosts, FuzzItem } from './models/index';
import { FuzzStringStyler } from './fuzz-string-styler.class';
import { FuzzDeepKeyFinder } from './fuzz-deep-key-finder.class';

export interface Fuzzalytics {
  editMatrix: number[][],
  operationMatrix: number[][],
  traversedCells: number[][],
  worstPossibleEditDistance: number,
}

/**
 * Fuzz
 */
export class Fuzz {

  public static readonly DEFAULT_FILTER_THRESHOLD: number = 0.4;
  public static readonly DEFAULT_EDIT_COSTS: EditCosts = {
    substitution: 101,
    deletion: 100,
    insertion: 100,
    preQueryInsertion: 1,
    postQueryInsertion: 2,
  }

  // just make this a util function
  public static getAllKeys (items: any[]) {
    const fdkf = new FuzzDeepKeyFinder();
    return fdkf.getAllKeys(items);
  }

  public static filter(
    items: any[],
    query: string,
    options: Partial<Fuzz> = {},
  ) {
    return Fuzz.search(
      items,
      query,
      options,
    ).map((fuzzItem: FuzzItem) => fuzzItem.original);
  }

  public static search(
    items: any[],
    query: string,
    options: Partial<Fuzz> = {},
  ) {
    const fuzz = new Fuzz();
    return fuzz.search(items, query, options);
  }

  public subjectKeys: string[] = [];
  public caseSensitive: boolean = false;
  public skipFilter: boolean = false;
  public skipSort: boolean = false;
  public startDecorator = '<b>';
  public endDecorator = '</b>';
  public filterThreshold: number = Fuzz.DEFAULT_FILTER_THRESHOLD;

  public editCosts: EditCosts = { ...Fuzz.DEFAULT_EDIT_COSTS };
  public diagnosticsByFuzzItem: WeakMap<FuzzItem, Fuzzalytics> = new WeakMap<FuzzItem, Fuzzalytics>();
  public allFuzzItemsByKeyByOriginal: WeakMap<any, any> = new WeakMap<any, any>();

  constructor(
    public stringStyler: FuzzStringStyler = new FuzzStringStyler(),
    public keyFinder: FuzzDeepKeyFinder = new FuzzDeepKeyFinder(),
  ) {}

  public search(
    items: any[],
    query: string,
    options: Partial<Fuzz> = {},
  ) {
    Object.assign(this, options);

    let fuzzItems = this.getScoredFuzzItems(items, query, this.subjectKeys);

    // Used for diagnostics
    fuzzItems.forEach((fuzzItem: FuzzItem) => {
      let fuzzItemsByKey = this.allFuzzItemsByKeyByOriginal.get(fuzzItem.original);
      if (!fuzzItemsByKey) {
        fuzzItemsByKey = {};
      }
      fuzzItemsByKey[fuzzItem.key] = fuzzItem;
      this.allFuzzItemsByKeyByOriginal.set(fuzzItem.original, fuzzItemsByKey);
    });

    if (!this.skipFilter && query) {
      fuzzItems = fuzzItems.filter((fuzzItem: FuzzItem) => fuzzItem.score >= this.filterThreshold);
    }
    if (!this.skipSort) {
      fuzzItems.sort((a: FuzzItem, b: FuzzItem) => b.score - a.score);
    }
    return uniqBy(fuzzItems, (fuzzItem: FuzzItem) => fuzzItem.original);
  }

  public getScoredFuzzItems(
    items: any[],
    query: string,
    subjectKeys: string[] = [],
  ): FuzzItem[] {
    subjectKeys = subjectKeys.length
      ? subjectKeys
      : this.keyFinder.getAllKeys(items);

    const fuzzItems: FuzzItem[] = this.getFuzzItems(items, subjectKeys, query);
    this.scoreFuzzItems(fuzzItems);
    return fuzzItems;
  }

  public getFuzzItems(
    items: any[],
    subjectKeys: string[],
    query: string
  ): FuzzItem[] {
    const fuzzItems: FuzzItem[] = [];
    items.forEach((item: any) => {
      subjectKeys.forEach((key: string) => {
        const subject = get(item, key);
        if (subject === undefined) {
          return;
        }
        fuzzItems.push({
          original: item,
          key: key,
          subject: String(subject),
          query: String(query),
        } as FuzzItem);
      });
    });
    return fuzzItems;
  }

  public scoreFuzzItems(fuzzItems: FuzzItem[]) {
    fuzzItems.forEach((fuzzItem: FuzzItem) => {
      const editMatrix = this.getInitialEditMatrix(
        fuzzItem.query,
        fuzzItem.subject,
        this.editCosts,
      );
      const operationMatrix = this.fillEditMatrix(
        editMatrix,
        this.caseSensitive ? fuzzItem.query : fuzzItem.query.toLowerCase(),
        this.caseSensitive ? fuzzItem.subject : fuzzItem.subject.toLowerCase(),
        this.editCosts,
      );
      const [matchRanges, traversedCells] = this.getMatchRanges(operationMatrix);

      this.diagnosticsByFuzzItem.set(fuzzItem, {
        editMatrix,
        operationMatrix,
        traversedCells,
      } as Fuzzalytics);

      // this equation could change based on editCosts!
      const worstPossibleEditDistance = (fuzzItem.query.length * this.editCosts.deletion)
        + (fuzzItem.subject.length * Math.min(this.editCosts.postQueryInsertion, this.editCosts.preQueryInsertion));

      fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
      fuzzItem.score = (worstPossibleEditDistance === 0)
        ? 1
        : 1 - (fuzzItem.editDistance / worstPossibleEditDistance);

      this.diagnosticsByFuzzItem.get(fuzzItem).worstPossibleEditDistance = worstPossibleEditDistance;

      fuzzItem.matchRanges = matchRanges;
      fuzzItem.styledString = this.stringStyler.styleWithTags(
        fuzzItem.subject,
        matchRanges,
        this.startDecorator,
        this.endDecorator,
      )
    });
  }

  public getInitialEditMatrix(
    query: string,
    subject: string,
    editCosts: EditCosts,
  ): number[][] {
    const height = query.length + 1;
    const width = subject.length + 1;

    const firstRow = [];
    for (let i = 0; i < width; i++) {
      firstRow.push(i * editCosts.preQueryInsertion);
    }

    const initialEditMatrix = [firstRow];
    for (let i = 1; i < height; i++) {
      const row = new Array(width);
      row[0] = i * editCosts.deletion;
      initialEditMatrix.push(row);
    }
    return initialEditMatrix;
  }

  /**
   * fillEditMatrix
   * todo: reuse matrices to reduce gc
   * @return {number[]}
   */
  public fillEditMatrix(
    matrix: number[][],
    query: string,
    subject: string,
    editCosts: EditCosts,
  ): number[][] {
    const height = matrix.length;
    const width = matrix[0].length;
    const operationMatrix = this.getInitialOperationMatrix(height, width);
    for (let rowIndex = 1; rowIndex < height; rowIndex++) {
      const insertionCost = rowIndex === (height - 1) ? editCosts.postQueryInsertion : editCosts.insertion;
      for (let columnIndex = 1; columnIndex < width; columnIndex++) {
        const doesSubstitutionReplace = query[rowIndex - 1] !== subject[columnIndex - 1];
        const substitutionCost = doesSubstitutionReplace ? editCosts.substitution : 0;
        const operationCosts = [
          matrix[rowIndex - 1][columnIndex] + editCosts.deletion,
          matrix[rowIndex][columnIndex - 1] + insertionCost,
          matrix[rowIndex - 1][columnIndex - 1] + substitutionCost,
        ];
        const operationIndex = getMinIndex(operationCosts);
        matrix[rowIndex][columnIndex] = operationCosts[operationIndex];
        if (operationIndex === 2 && !doesSubstitutionReplace) {
          operationMatrix[rowIndex][columnIndex] = 3;
        } else {
          operationMatrix[rowIndex][columnIndex] = operationIndex;
        }
      }
    }
    return operationMatrix;
  }

  /**
   * getInitialOperationMatrix
   * @return {number[]}
   */
  public getInitialOperationMatrix(height: number, width: number): number[][] {
    const firstRow = [];
    for (let i = 0; i < width; i++) {
      firstRow.push(1);
    }

    const operationMatrix = [firstRow];
    for(let i = 1; i < height; i++) {
      const row = new Array(width);
      row[0] = 0;
      operationMatrix.push(row);
    }
    return operationMatrix;
  }

  /**
   * getMatchRanges
   * operationMatrix numbers stand for { 0: delete, 1: insert, 2: sub, 3: noop }
   * @return {number[]}
   */
  public getMatchRanges(operationMatrix: number[][]): Array<number[][]> {
    let yLoc = operationMatrix.length - 1;
    let xLoc = operationMatrix[0].length - 1;
    let matchRanges: number[][] = [];
    let range: number[];

    let traversedCells = [[0, 0]];

    while (yLoc !== 0 || xLoc !== 0) {
      traversedCells.push([yLoc, xLoc]);
      switch(operationMatrix[yLoc][xLoc]) {
        case 0:
          yLoc--
          // deleting a character from subject does not break the matchRange streak
          break;
        case 1:
          xLoc--;
          if (range) {
            matchRanges.push(range);
            range = undefined;
          }
          break;
        case 2:
          yLoc--;
          xLoc--;
          if (range) {
            matchRanges.push(range);
            range = undefined;
          }
          break;
        case 3:
          yLoc--;
          xLoc--;
          if (range) {
            // continues matchRange streak
            range[0] = xLoc;
          } else {
            // starts the matchRange streak
            range = [xLoc, xLoc];
          }
          break;
      }
    }
    if (range) {
      matchRanges.push(range);
    }
    return [matchRanges.reverse(), traversedCells];
  }

}

function get(
  item: any,
  keysString: string,
) {
  const keys = keysString.split('.');
  for(let i = 0; i < keys.length; i++) {
    if(item === undefined || item === null) {
      return;
    }
    item = item[keys[i]]
  }
  return item;
}

function uniqBy(
  items: any[],
  getItemKey: (item: any) => any = identity,
) {
  const itemKeySet = new Set();
  return items.filter((item: any) => {
    const key = getItemKey(item);
    if (itemKeySet.has(key)) {
      return false;
    } else {
      itemKeySet.add(key);
      return true;
    }
  })
}

function identity(item: any) {
  return item;
}

function getMinIndex(numbers: number[]): number {
  let minIndex = 0;
  let minValue = numbers[0];
  for (let nextIndex = 1; nextIndex < numbers.length; nextIndex++) {
    const nextValue = numbers[nextIndex];
    if (nextValue < minValue) {
      minIndex = nextIndex;
      minValue = nextValue;
    }
  }
  return minIndex;
}
