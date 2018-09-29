
export interface FuzzItem {
	original: any,
	subject: string,
	query: string,
	editMatrix: number[][],
	editDistance: number,
};
