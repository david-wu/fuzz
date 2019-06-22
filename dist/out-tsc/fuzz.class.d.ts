import { EditCosts, FuzzItem } from './models/index';
import { FuzzStringStyler } from './fuzz-string-styler.class';
import { FuzzDeepKeyFinder } from './fuzz-deep-key-finder.class';
export interface Fuzzalytics {
    editMatrix: number[][];
    operationMatrix: number[][];
    traversedCells: number[][];
    worstPossibleEditDistance: number;
}
export declare class Fuzz {
    stringStyler: FuzzStringStyler;
    keyFinder: FuzzDeepKeyFinder;
    static readonly DEFAULT_FILTER_THRESHOLD: number;
    static readonly DEFAULT_EDIT_COSTS: EditCosts;
    static getAllKeys(items: any[]): string[];
    static filter(items: any[], query: string, options?: Partial<Fuzz>): any[];
    static search(items: any[], query: string, options?: Partial<Fuzz>): any[];
    subjectKeys: string[];
    caseSensitive: boolean;
    skipFilter: boolean;
    skipSort: boolean;
    startDecorator: string;
    endDecorator: string;
    filterThreshold: number;
    editCosts: EditCosts;
    diagnosticsByFuzzItem: WeakMap<FuzzItem, Fuzzalytics>;
    allFuzzItemsByKeyByOriginal: WeakMap<any, any>;
    constructor(stringStyler?: FuzzStringStyler, keyFinder?: FuzzDeepKeyFinder);
    search(items: any[], query: string, options?: Partial<Fuzz>): any[];
    getScoredFuzzItems(items: any[], query: string, subjectKeys?: string[]): FuzzItem[];
    getFuzzItems(items: any[], subjectKeys: string[], query: string): FuzzItem[];
    scoreFuzzItems(fuzzItems: FuzzItem[]): void;
    getInitialEditMatrix(query: string, subject: string, editCosts: EditCosts): number[][];
    fillEditMatrix(matrix: number[][], query: string, subject: string, editCosts: EditCosts): number[][];
    getInitialOperationMatrix(height: number, width: number): number[][];
    getMatchRanges(operationMatrix: number[][]): Array<number[][]>;
}
