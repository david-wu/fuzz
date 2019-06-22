
export interface FuzzItem {
	original: any;
	key: string;
	subject: string;
	query: string;
	editDistance: number;
	matchRanges: number[][];
	styledString: string;
	score: number;
};
