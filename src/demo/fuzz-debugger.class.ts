import { EditCosts, FuzzItem } from '../models';

export class FuzzDebugger {

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
