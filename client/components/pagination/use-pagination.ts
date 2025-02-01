import { useCallback, useMemo, useState } from "react";
import type { PaginationOptions } from "./types";

export function usePagination<T>({
	data,
	contentLimit,
	pageButtonLimit,
	sortBy,
}: PaginationOptions<T>) {
	const [currentPage, setCurrentPage] = useState(1);

	const currentPageContents = useMemo(() => {
		if (!data) return [];
		return data
			.slice((currentPage - 1) * contentLimit, currentPage * contentLimit)
			.sort(sortBy);
	}, [data, currentPage, contentLimit, sortBy]);

	const buttons = useMemo(() => {
		if (!data) return [];
		return Array.from({ length: Math.ceil(data.length / contentLimit) }, (_, i) => i + 1);
	}, [data, contentLimit]);

	const prev = useCallback(() => setCurrentPage((p) => (p === 1 ? p : p - 1)), [setCurrentPage]);
	const goto = useCallback((page: number) => setCurrentPage(page), [setCurrentPage]);
	const next = useCallback(() => {
		if (!data) return;
		return setCurrentPage((p) => (p === Math.ceil(data.length / contentLimit) ? p : p + 1));
	}, [setCurrentPage]);

	return {
		data,
		contentLimit,
		currentPage,
		currentPageContents,
		prev,
		next,
		goto,
		buttons,
		pageButtonLimit,
	};
}
