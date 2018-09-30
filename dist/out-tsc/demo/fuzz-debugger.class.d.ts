import { FuzzItem } from '../models';
export declare class FuzzDebugger {
    static readonly operationStringByOperation: {
        [operation: number]: string;
    };
    debugFuzzItem(fuzzItem: FuzzItem): string;
    debugEditMatrix(fuzzItem: FuzzItem): string;
    debugOperationMatrix(fuzzItem: FuzzItem): string;
}
