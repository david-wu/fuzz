import { EditCosts, FuzzItem } from './models';
export declare class Fuzz {
    static readonly DEFAULT_EDIT_COSTS: EditCosts;
    static readonly DEFAULT_FILTER_THRESHOLD: number;
    editCosts: EditCosts;
    filterThreshold: number;
    filterSort(items: any[], subjectKeys: string[], query: string, filterThreshold?: number): FuzzItem[];
    sort(items: any[], subjectKeys: string[], query: string): FuzzItem[];
    getFuzzItems(items: any[], subjectKeys: string[], query: string): FuzzItem[];
    scoreFuzzItems(fuzzItems: FuzzItem[]): void;
    getInitialEditMatrix(query: string, subject: string, editCosts: EditCosts): number[][];
    fillEditMatrix(matrix: number[][], query: string, subject: string, editCosts: EditCosts): number[][];
    getInitialOperationMatrix(height: number, width: number): number[][];
    getMatchRanges(operationMatrix: number[][]): number[][];
}
