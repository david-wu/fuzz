import { EditCosts, FuzzItem } from './models/index';
import { FuzzStringStyler } from './fuzz-string-styler.class';
import { FuzzDeepKeyFinder } from './fuzz-deep-key-finder.class';
import { FuzzDiagnostics } from './fuzz-diagnostics.class';
export declare class Fuzz {
    stringStyler: FuzzStringStyler;
    keyFinder: FuzzDeepKeyFinder;
    diagnostics: FuzzDiagnostics;
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
    disableDiagnostics: boolean;
    disableStyledString: boolean;
    constructor(stringStyler?: FuzzStringStyler, keyFinder?: FuzzDeepKeyFinder, diagnostics?: FuzzDiagnostics);
    search(items: any[], query: string, options?: Partial<Fuzz>): any[];
    getScoredFuzzItems(items: any[], query: string, subjectKeys?: string[]): FuzzItem[];
    getFuzzItems(items: any[], subjectKeys: string[], query: string): FuzzItem[];
    scoreFuzzItems(fuzzItems: FuzzItem[]): void;
    getInitialEditMatrix(query: string, subject: string, editCosts: EditCosts): number[][];
    fillEditMatrix(matrix: number[][], query: string, subject: string, editCosts: EditCosts): number[][];
    getInitialOperationMatrix(height: number, width: number): number[][];
    getMatchRanges(operationMatrix: number[][]): Array<number[][]>;
}
