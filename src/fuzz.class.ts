
import { EditCosts, FuzzItem } from './models';

export class Fuzz {

	public static readonly DEFAULT_EDIT_COSTS: EditCosts = {
		substitution: 141,
		deletion: 100,
		insertion: 100,
		preQueryInsertion: 10,
		postQueryInsertion: 5,
	}

	public editCosts = { ...Fuzz.DEFAULT_EDIT_COSTS } as EditCosts;

	public filterSort(
		items: any[],
		subjectKeys: string[],
		query: string,
		editDistancePerQueryLength: number = 50,
	) {
		const fuzzItems: FuzzItem[] = this.getFuzzItems(items, subjectKeys, query);
		this.scoreFuzzItems(fuzzItems);
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
					subject: item[key],
					query: query,
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
			this.fillEditMatrix(
				editMatrix,
				fuzzItem.query,
				fuzzItem.subject,
				this.editCosts,
			);
			fuzzItem.editMatrix = editMatrix;
			fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
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
		for (let rowIndex = 1; rowIndex < height; rowIndex++) {
			const insertionCost = rowIndex === (height - 1) ? editCosts.postQueryInsertion : editCosts.insertion;
			for (let columnIndex = 1; columnIndex < width; columnIndex++) {
				const substitutionCost = query[rowIndex - 1] === subject[columnIndex - 1] ? 0 : editCosts.substitution;
				const lowestAccumulatedCost = Math.min(
					matrix[rowIndex - 1][columnIndex] + editCosts.deletion,
					matrix[rowIndex][columnIndex - 1] + insertionCost,
					matrix[rowIndex - 1][columnIndex - 1] + substitutionCost,
				);
				matrix[rowIndex][columnIndex] = lowestAccumulatedCost;
			}
		}
		return matrix;
	}

	public debugFuzzItem(fuzzItem: FuzzItem): string {
		const tableHeader: string = fuzzItem.subject.split('').map((character: string) => padString(character, 6)).join('');
		const tableRows: string[] = fuzzItem.editMatrix.map((row: number[], rowIndex: number) => {
			const rowString = row.map((cell: number) => padString(cell, 6)).join('');
			return `${fuzzItem.query[rowIndex - 1] || ' '} ${rowString}`;
		});
		return [
			`\nquery: ${fuzzItem.query}, subject: ${fuzzItem.subject}, editDistance: ${fuzzItem.editDistance}`,
			`        ${tableHeader}`,
			...tableRows,
		].join('\n')
	}
}


function padString(subject: any, padding: number): string {
	return (' '.repeat(padding) + subject).slice(-padding);
}
