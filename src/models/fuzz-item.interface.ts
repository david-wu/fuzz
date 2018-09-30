
export interface FuzzItem {
	original: any,
	key: string,
	subject: string,
	query: string,
	editMatrix: number[][],
	editDistance: number,
	operationMatrix: number[][],
	matchLocations: number[],
};
