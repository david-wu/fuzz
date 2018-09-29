import { EditCosts, FuzzItem } from './models';
export declare class Fuzz {
    static readonly DEFAULT_EDIT_THRESHOLD: number;
    static readonly DEFAULT_EDIT_COSTS: EditCosts;
    editCosts: EditCosts;
    editDistancePerQueryLength: number;
    filterSort(items: any[], subjectKeys: string[], query: string, editDistancePerQueryLength?: number): FuzzItem[];
    sort(items: any[], subjectKeys: string[], query: string): FuzzItem[];
    getFuzzItems(items: any[], subjectKeys: string[], query: string): FuzzItem[];
    scoreFuzzItems(fuzzItems: FuzzItem[]): void;
    getInitialEditMatrix(query: string, subject: string, editCosts: EditCosts): number[][];
    fillEditMatrix(matrix: number[][], query: string, subject: string, editCosts: EditCosts): number[][];
    debugFuzzItem(fuzzItem: FuzzItem): string;
}
