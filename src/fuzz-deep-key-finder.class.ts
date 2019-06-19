
export class FuzzDeepKeyFinder {

	public getAllKeys(allObjects: any[]) {
		const allKeys = new Set();
		allObjects.forEach((targetObject) => {
			const objectKeys = this.getKeysDeep(targetObject);
			objectKeys.forEach((objectKey) => {
				allKeys.add(objectKey);
			});
		});
		return Array.from(allKeys);
	}

	public getKeysDeep(targetObject: any, currentPath: string, visitedObjects: Set<any>) {
	  visitedObjects = visitedObjects || new Set();

	  const childKeys = this.getKeys(targetObject)

	  const searchableKeys = childKeys
	    .filter((childKey) => this.isSearchableValue(targetObject[childKey]))
	    .map((searchableKey) => {
	      return (currentPath === undefined)
	        ? searchableKey
	        : `${currentPath}.${searchableKey}`;
	    });

	  childKeys.forEach((childKey) => {
	    const nextObject = targetObject[childKey];
	    const nextPath = (currentPath === undefined)
	      ? childKey
	      : `${currentPath}.${childKey}`;

	    if (visitedObjects.has(nextObject)) {
	      return;
	    }
	    visitedObjects.add(nextObject);

	    const childKeys = this.getKeysDeep(nextObject, nextPath, visitedObjects);
	    searchableKeys.push.apply(searchableKeys, childKeys);
	  });

	  return searchableKeys;
	}

	public isSearchableValue(value) {
	  return ['string', 'number'].includes(typeof value);
	}

	public getKeys(targetObject) {
	  if (targetObject === null || targetObject === undefined) {
	    return [];
	  }
	  if (typeof targetObject === 'string') {
	    return [];
	  }
	  return Object.keys(targetObject);
	}

}
