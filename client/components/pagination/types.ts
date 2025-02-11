export type PaginationOptions<T> = {
	data: T[] | undefined;
	sortBy: (a: T, b: T) => number;
	contentLimit: number;
	pageButtonLimit: number;
};
