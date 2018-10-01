import { EditCosts, FuzzItem } from '../models';

export class FuzzDebugger {

	public static readonly operationStringByOperation: {[operation: number]: string} = {
		0: 'del',
		1: 'ins',
		2: 'sub',
		3: 'nop',
	}

	public debugFuzzItem(fuzzItem: FuzzItem): string {
		return [
			'\n=======================================\n',
			`Query: ${fuzzItem.query}, subject: ${fuzzItem.subject}, editDistance: ${fuzzItem.editDistance}`,
			'\nEdit Matrix:',
			this.debugEditMatrix(fuzzItem),
			'\nOperation Matrix:',
			this.debugOperationMatrix(fuzzItem),
			'\nMatch Ranges:',
			this.debugMatchRanges(fuzzItem.matchRanges),
		].join('\n')
	}

	public debugEditMatrix(fuzzItem: FuzzItem): string {
		const tableHeader: string = fuzzItem.subject.split('').map((character: string) => padString(character, 6)).join('');
		const tableRows: string[] = fuzzItem.editMatrix.map((row: number[], rowIndex: number) => {
			const rowString = row.map((cell: number) => padString(cell, 6)).join('');
			return `${fuzzItem.query[rowIndex - 1] || ' '} ${rowString}`;
		});
		return [
			`        ${tableHeader}`,
			...tableRows,
		].join('\n')
	}

	public debugOperationMatrix(fuzzItem: FuzzItem): string {
		const tableHeader: string = fuzzItem.subject.split('').map((character: string) => padString(character, 6)).join('');
		const tableRows: string[] = fuzzItem.operationMatrix.map((row: number[], rowIndex: number) => {
			const rowString = row.map((cell: number) => padString(FuzzDebugger.operationStringByOperation[cell], 6)).join('');
			return `${fuzzItem.query[rowIndex - 1] || ' '} ${rowString}`;
		});
		return [
			`        ${tableHeader}`,
			...tableRows,
		].join('\n')
	}

	public debugMatchRanges(ranges: number[][]) {
		return ranges.map((range: number[]) => {
			return `[${range.join(', ')}]`;
		}).join(', ');
	}

}

function padString(subject: any, padding: number): string {
	return (' '.repeat(padding) + subject).slice(-padding);
}
