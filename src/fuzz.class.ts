import { EditCosts } from './models/edit-costs.interface';

export interface FuzzItem {
	original: any,
	subject: string,
	query: string,
	editMatrix: number[][],
	editDistance: number,
};

export const defaultEditCosts: EditCosts = {
	substitution: 141,
	deletion: 100,
	insertion: 100,
	preQueryInsertion: 5,
	postQueryInsertion: 10,
};

export class Fuzz {

	public sort(items: any[], subjectKeys: string[], query: string) {
		const fuzzItems: FuzzItem[] = [];
		items.forEach((item: any) => {
			subjectKeys.forEach((key: string) => {
				fuzzItems.push({
					original: item,
					subject: item[key],
					query: query,
				} as FuzzItem)
			});
		});

		this.scoreFuzzItems(fuzzItems);
		fuzzItems.sort((a: FuzzItem, b: FuzzItem) => a.editDistance - b.editDistance);
		return fuzzItems
	}

	public scoreFuzzItems(fuzzItems: FuzzItem[]) {
		fuzzItems.forEach((fuzzItem: FuzzItem) => {
			const editMatrix = this.getInitialMatrix(
				fuzzItem.query.length + 1,
				fuzzItem.subject.length + 1,
				defaultEditCosts,
			);
			this.fillMatrix(
				editMatrix,
				fuzzItem.query,
				fuzzItem.subject,
				defaultEditCosts,
			);
			fuzzItem.editMatrix = editMatrix;
			fuzzItem.editDistance = editMatrix[editMatrix.length - 1][editMatrix[0].length - 1];
		});
	}

	public fillMatrix(
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

	public getInitialMatrix(
		height: number,
		width: number,
		editCosts: EditCosts
	): number[][] {

		const firstRow = [];
		for (let i = 0; i < width; i++) {
			firstRow.push(i * editCosts.preQueryInsertion);
		}

		const initialMatrix = [firstRow];
		for (let i = 1; i < height; i++) {
			const row = new Array(width);
			row[0] = i * editCosts.deletion
			initialMatrix.push(row);
		}
		return initialMatrix;
	}

	public debugFuzzItem(fuzzItem: FuzzItem) {
		console.log(`\n\nsubject: ${fuzzItem.subject}, query: ${fuzzItem.query}, editDistance: ${fuzzItem.editDistance}`);
		const tableHeader = fuzzItem.subject.split('').map((character: string) => padString(character, 5)).join('');
		console.log(`       ${tableHeader}`);

		fuzzItem.editMatrix.forEach((row: number[], rowIndex: number) => {
			const rowString = row.map((cell: number) => padString(cell, 5)).join('');
			console.log(`${fuzzItem.query[rowIndex - 1] || ' '} ${rowString}`);
		});
	}

}

function padString(subject: any, padding: number) {
	return (' '.repeat(padding) + subject).slice(-padding);
}
