import { FuzzItem } from './models/index';
interface FuzzItemByKey {
    [key: string]: FuzzItem;
}
export interface Fuzzalytics {
    editMatrix: number[][];
    operationMatrix: number[][];
    traversedCells: number[][];
    worstPossibleEditDistance: number;
}
export declare class FuzzDiagnostics {
    allFuzzItemsByKeyByOriginal: WeakMap<any, FuzzItemByKey>;
    fuzzalyticsByFuzzItem: WeakMap<FuzzItem, Fuzzalytics>;
    indexFuzzItems(fuzzItems: FuzzItem[]): void;
    setFuzzalyticsForFuzzItem(fuzzItem: FuzzItem, fuzzalytics: Fuzzalytics): void;
}
export {};
