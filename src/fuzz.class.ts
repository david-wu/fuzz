import { EditCosts, FuzzItem } from './models/index';
import { FuzzStringStyler } from './fuzz-string-styler.class';
import { FuzzDeepKeyFinder } from './fuzz-deep-key-finder.class';


/**
 * Fuzz
 */
export class Fuzz {

  public static readonly DEFAULT_FILTER_THRESHOLD: number = 0.5;
  public static readonly DEFAULT_EDIT_COSTS: EditCosts = {
    substitution: 141,
    deletion: 100,
    insertion: 100,
    preQueryInsertion: 1,
    postQueryInsertion: 0,
  }
  public static getAllKeys (items: any[]) {
    const fdkf = new FuzzDeepKeyFinder();
    return fdkf.getAllKeys(items);
  }

  public isCaseSensitive: boolean = false;
  public startDecorator = '<b>';
  public endDecorator = '</b>';
  public filterThreshold: number = Fuzz.DEFAULT_FILTER_THRESHOLD;
  public editCosts: EditCosts = { ...Fuzz.DEFAULT_EDIT_COSTS };
  public omitEditMatrix: boolean = true;
  public omitOperationMatrix: boolean = true;

  constructor(
    public stringStyler: FuzzStringStyler = new FuzzStringStyler(),
    public keyFinder: FuzzDeepKeyFinder = new FuzzDeepKeyFinder(),
  ) {}

  public filterSort(
    items: any[],
    query: string,
    subjectKeys?: string[],
    filterThreshold: number = this.filterThreshold,
  ): FuzzItem[] {
    let filteredFuzzItems = this.getScoredFuzzItems(items, query, subjectKeys);
    if (query) {
      filteredFuzzItems = filteredFuzzItems
        .filter((fuzzItem: FuzzItem) => fuzzItem.score >= filterThreshold)
        .sort((a: FuzzItem, b: FuzzItem) => b.score - a.score);
    }
    return uniqBy(filteredFuzzItems, (fuzzItem: FuzzItem) => fuzzItem.original);
  }

  public filter(
    items: any[],
    query: string,
    subjectKeys?: string[],
    filterThreshold: number = this.filterThreshold,
  ): FuzzItem[] {
    let filteredFuzzItems = this.getScoredFuzzItems(items, query, subjectKeys);
    if (query) {
      filteredFuzzItems = filteredFuzzItems
        .filter((fuzzItem: FuzzItem) => fuzzItem.score >= filterThreshold);
    }
    return uniqBy(filteredFuzzItems, (fuzzItem: FuzzItem) => fuzzItem.original);
  }

  public sort(
    items: any[],
    query: string,
    subjectKeys?: string[],
  ): FuzzItem[] {
    const fuzzItems = this.getScoredFuzzItems(items, query, subjectKeys);
    if (query) {
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
          subject,
          query,
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
        this.isCaseSensitive ? fuzzItem.query : fuzzItem.query.toLowerCase(),
        this.isCaseSensitive ? fuzzItem.subject : fuzzItem.subject.toLowerCase(),
        this.editCosts,
      );
      const matchRanges = this.getMatchRanges(operationMatrix);

      if(!this.omitEditMatrix) {
        fuzzItem.editMatrix = editMatrix;
      }
      if(!this.omitOperationMatrix) {
        fuzzItem.operationMatrix = operationMatrix;
      }

      // this equation could change based on editCosts!
      const worstPossibleEditDistance = (fuzzItem.query.length * this.editCosts.deletion)
        + (fuzzItem.subject.length * Math.min(this.editCosts.postQueryInsertion, this.editCosts.preQueryInsertion));

      fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
      fuzzItem.score = ((worstPossibleEditDistance - fuzzItem.editDistance) / worstPossibleEditDistance);
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

  public getMatchRanges(operationMatrix: number[][]): number[][] {
    let yLoc = operationMatrix.length - 1;
    let xLoc = operationMatrix[0].length - 1;
    let matchRanges: number[][] = [];
    let range: number[];

    while (yLoc !== 0 || xLoc !== 0) {
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
    return matchRanges.reverse();
  }

}

function get(
  item: any,
  keysString: string,
) {
  const keys = keysString.split('.');
  for(let i = 0; i < keys.length; i++) {
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
