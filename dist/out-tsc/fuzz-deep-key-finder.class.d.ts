export declare class FuzzDeepKeyFinder {
    getAllKeys(allObjects: any[]): string[];
    getKeysDeep(targetObject: any, currentPath?: string, visitedObjects?: Set<any>): string[];
    isSearchableValue(value: any): boolean;
    getKeys(targetObject: any): string[];
}
