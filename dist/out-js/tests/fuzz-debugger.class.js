// import { EditCosts, FuzzItem } from '../models';
// export class FuzzDebugger {
// 	public static readonly operationStringByOperation: {[operation: number]: string} = {
// 		0: 'del',
// 		1: 'ins',
// 		2: 'sub',
// 		3: 'nop',
// 	}
// 	public debugFuzzItem(fuzzItem: FuzzItem): string {
// 		return [
// 			'\n=======================================\n',
// 			`Query: ${fuzzItem.query}, subject: ${fuzzItem.subject}, key: ${fuzzItem.key}, editDistance: ${fuzzItem.editDistance}`,
// 			'\nEdit Matrix:',
// 			this.debugEditMatrix(fuzzItem),
// 			'\nOperation Matrix:',
// 			this.debugOperationMatrix(fuzzItem),
// 			'\nMatch Ranges:',
// 			this.debugMatchRanges(fuzzItem.matchRanges),
// 		].join('\n')
// 	}
// 	public debugEditMatrix(fuzzItem: FuzzItem): string {
// 		const tableHeader: string = fuzzItem.subject.split('').map((character: string) => padString(character, 6)).join('');
// 		const tableRows: string[] = fuzzItem.editMatrix.map((row: number[], rowIndex: number) => {
// 			const rowString = row.map((cell: number) => padString(cell, 6)).join('');
// 			return `${fuzzItem.query[rowIndex - 1] || ' '} ${rowString}`;
// 		});
// 		return [
// 			`        ${tableHeader}`,
// 			...tableRows,
// 		].join('\n')
// 	}
// 	public debugOperationMatrix(fuzzItem: FuzzItem): string {
// 		const tableHeader: string = fuzzItem.subject.split('').map((character: string) => padString(character, 6)).join('');
// 		const tableRows: string[] = fuzzItem.operationMatrix.map((row: number[], rowIndex: number) => {
// 			const rowString = row.map((cell: number) => padString(FuzzDebugger.operationStringByOperation[cell], 6)).join('');
// 			return `${fuzzItem.query[rowIndex - 1] || ' '} ${rowString}`;
// 		});
// 		return [
// 			`        ${tableHeader}`,
// 			...tableRows,
// 		].join('\n')
// 	}
// 	public debugMatchRanges(ranges: number[][]) {
// 		return ranges.map((range: number[]) => {
// 			return `[${range.join(', ')}]`;
// 		}).join(', ');
// 	}
// }
// function padString(subject: any, padding: number): string {
// 	return (' '.repeat(padding) + subject).slice(-padding);
// }
"use strict";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9mdXp6LWRlYnVnZ2VyLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IEVkaXRDb3N0cywgRnV6ekl0ZW0gfSBmcm9tICcuLi9tb2RlbHMnO1xuXG4vLyBleHBvcnQgY2xhc3MgRnV6ekRlYnVnZ2VyIHtcblxuLy8gXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IG9wZXJhdGlvblN0cmluZ0J5T3BlcmF0aW9uOiB7W29wZXJhdGlvbjogbnVtYmVyXTogc3RyaW5nfSA9IHtcbi8vIFx0XHQwOiAnZGVsJyxcbi8vIFx0XHQxOiAnaW5zJyxcbi8vIFx0XHQyOiAnc3ViJyxcbi8vIFx0XHQzOiAnbm9wJyxcbi8vIFx0fVxuXG4vLyBcdHB1YmxpYyBkZWJ1Z0Z1enpJdGVtKGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG4vLyBcdFx0cmV0dXJuIFtcbi8vIFx0XHRcdCdcXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cXG4nLFxuLy8gXHRcdFx0YFF1ZXJ5OiAke2Z1enpJdGVtLnF1ZXJ5fSwgc3ViamVjdDogJHtmdXp6SXRlbS5zdWJqZWN0fSwga2V5OiAke2Z1enpJdGVtLmtleX0sIGVkaXREaXN0YW5jZTogJHtmdXp6SXRlbS5lZGl0RGlzdGFuY2V9YCxcbi8vIFx0XHRcdCdcXG5FZGl0IE1hdHJpeDonLFxuLy8gXHRcdFx0dGhpcy5kZWJ1Z0VkaXRNYXRyaXgoZnV6ekl0ZW0pLFxuLy8gXHRcdFx0J1xcbk9wZXJhdGlvbiBNYXRyaXg6Jyxcbi8vIFx0XHRcdHRoaXMuZGVidWdPcGVyYXRpb25NYXRyaXgoZnV6ekl0ZW0pLFxuLy8gXHRcdFx0J1xcbk1hdGNoIFJhbmdlczonLFxuLy8gXHRcdFx0dGhpcy5kZWJ1Z01hdGNoUmFuZ2VzKGZ1enpJdGVtLm1hdGNoUmFuZ2VzKSxcbi8vIFx0XHRdLmpvaW4oJ1xcbicpXG4vLyBcdH1cblxuLy8gXHRwdWJsaWMgZGVidWdFZGl0TWF0cml4KGZ1enpJdGVtOiBGdXp6SXRlbSk6IHN0cmluZyB7XG4vLyBcdFx0Y29uc3QgdGFibGVIZWFkZXI6IHN0cmluZyA9IGZ1enpJdGVtLnN1YmplY3Quc3BsaXQoJycpLm1hcCgoY2hhcmFjdGVyOiBzdHJpbmcpID0+IHBhZFN0cmluZyhjaGFyYWN0ZXIsIDYpKS5qb2luKCcnKTtcbi8vIFx0XHRjb25zdCB0YWJsZVJvd3M6IHN0cmluZ1tdID0gZnV6ekl0ZW0uZWRpdE1hdHJpeC5tYXAoKHJvdzogbnVtYmVyW10sIHJvd0luZGV4OiBudW1iZXIpID0+IHtcbi8vIFx0XHRcdGNvbnN0IHJvd1N0cmluZyA9IHJvdy5tYXAoKGNlbGw6IG51bWJlcikgPT4gcGFkU3RyaW5nKGNlbGwsIDYpKS5qb2luKCcnKTtcbi8vIFx0XHRcdHJldHVybiBgJHtmdXp6SXRlbS5xdWVyeVtyb3dJbmRleCAtIDFdIHx8ICcgJ30gJHtyb3dTdHJpbmd9YDtcbi8vIFx0XHR9KTtcbi8vIFx0XHRyZXR1cm4gW1xuLy8gXHRcdFx0YCAgICAgICAgJHt0YWJsZUhlYWRlcn1gLFxuLy8gXHRcdFx0Li4udGFibGVSb3dzLFxuLy8gXHRcdF0uam9pbignXFxuJylcbi8vIFx0fVxuXG4vLyBcdHB1YmxpYyBkZWJ1Z09wZXJhdGlvbk1hdHJpeChmdXp6SXRlbTogRnV6ekl0ZW0pOiBzdHJpbmcge1xuLy8gXHRcdGNvbnN0IHRhYmxlSGVhZGVyOiBzdHJpbmcgPSBmdXp6SXRlbS5zdWJqZWN0LnNwbGl0KCcnKS5tYXAoKGNoYXJhY3Rlcjogc3RyaW5nKSA9PiBwYWRTdHJpbmcoY2hhcmFjdGVyLCA2KSkuam9pbignJyk7XG4vLyBcdFx0Y29uc3QgdGFibGVSb3dzOiBzdHJpbmdbXSA9IGZ1enpJdGVtLm9wZXJhdGlvbk1hdHJpeC5tYXAoKHJvdzogbnVtYmVyW10sIHJvd0luZGV4OiBudW1iZXIpID0+IHtcbi8vIFx0XHRcdGNvbnN0IHJvd1N0cmluZyA9IHJvdy5tYXAoKGNlbGw6IG51bWJlcikgPT4gcGFkU3RyaW5nKEZ1enpEZWJ1Z2dlci5vcGVyYXRpb25TdHJpbmdCeU9wZXJhdGlvbltjZWxsXSwgNikpLmpvaW4oJycpO1xuLy8gXHRcdFx0cmV0dXJuIGAke2Z1enpJdGVtLnF1ZXJ5W3Jvd0luZGV4IC0gMV0gfHwgJyAnfSAke3Jvd1N0cmluZ31gO1xuLy8gXHRcdH0pO1xuLy8gXHRcdHJldHVybiBbXG4vLyBcdFx0XHRgICAgICAgICAke3RhYmxlSGVhZGVyfWAsXG4vLyBcdFx0XHQuLi50YWJsZVJvd3MsXG4vLyBcdFx0XS5qb2luKCdcXG4nKVxuLy8gXHR9XG5cbi8vIFx0cHVibGljIGRlYnVnTWF0Y2hSYW5nZXMocmFuZ2VzOiBudW1iZXJbXVtdKSB7XG4vLyBcdFx0cmV0dXJuIHJhbmdlcy5tYXAoKHJhbmdlOiBudW1iZXJbXSkgPT4ge1xuLy8gXHRcdFx0cmV0dXJuIGBbJHtyYW5nZS5qb2luKCcsICcpfV1gO1xuLy8gXHRcdH0pLmpvaW4oJywgJyk7XG4vLyBcdH1cblxuLy8gfVxuXG4vLyBmdW5jdGlvbiBwYWRTdHJpbmcoc3ViamVjdDogYW55LCBwYWRkaW5nOiBudW1iZXIpOiBzdHJpbmcge1xuLy8gXHRyZXR1cm4gKCcgJy5yZXBlYXQocGFkZGluZykgKyBzdWJqZWN0KS5zbGljZSgtcGFkZGluZyk7XG4vLyB9XG4iXX0=