import { EditCosts, FuzzItem } from './models';

export class Fuzz {

	public static readonly DEFAULT_EDIT_THRESHOLD: number = 45;
	public static readonly DEFAULT_EDIT_COSTS: EditCosts = {
		substitution: 141,
		deletion: 100,
		insertion: 100,
		preQueryInsertion: 4,
		postQueryInsertion: 2,
	}

	public editCosts: EditCosts = { ...Fuzz.DEFAULT_EDIT_COSTS };
	public editDistancePerQueryLength: number = Fuzz.DEFAULT_EDIT_THRESHOLD;

	public filterSort(
		items: any[],
		subjectKeys: string[],
		query: string,
		editDistancePerQueryLength: number = this.editDistancePerQueryLength,
	): FuzzItem[] {
		const fuzzItems: FuzzItem[] = this.getFuzzItems(items, subjectKeys, query);
		this.scoreFuzzItems(fuzzItems);
		if (!query) { return fuzzItems; }
		const filteredFuzzItems = fuzzItems.filter((fuzzItem: FuzzItem) => {
			return fuzzItem.editDistance <= (editDistancePerQueryLength * fuzzItem.query.length);
		});
		filteredFuzzItems.sort((a: FuzzItem, b: FuzzItem) => a.editDistance - b.editDistance);
		return filteredFuzzItems;
	}

	public sort(
		items: any[],
		subjectKeys: string[],
		query: string,
	): FuzzItem[] {
		const fuzzItems: FuzzItem[] = this.getFuzzItems(items, subjectKeys, query);
		this.scoreFuzzItems(fuzzItems);
		if (!query) { return fuzzItems; }
		fuzzItems.sort((a: FuzzItem, b: FuzzItem) => a.editDistance - b.editDistance);
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
				fuzzItems.push({
					original: item,
					key: key,
					subject: item[key].toLowerCase(),
					query: query.toLowerCase(),
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
				fuzzItem.query,
				fuzzItem.subject,
				this.editCosts,
			);
			const matchRanges = this.getMatchRanges(operationMatrix);
			fuzzItem.editMatrix = editMatrix;
			fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
			fuzzItem.operationMatrix = operationMatrix;
			fuzzItem.matchRanges = matchRanges
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
