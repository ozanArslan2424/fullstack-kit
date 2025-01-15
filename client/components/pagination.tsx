import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Button, buttonStyles } from "./button";
import { Popover } from "./popover";

type PaginationOptions<T> = {
	data: T[] | undefined;
	sortBy: (a: T, b: T) => number;
	contentLimit: number;
	pageButtonLimit: number;
};

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

const PaginationContext = createContext<ReturnType<typeof usePagination> | null>(null);

function usePaginationContext() {
	const context = useContext(PaginationContext);
	if (!context) {
		throw new Error("usePaginationContext must be used within a PaginationProvider");
	}
	return context;
}

export function PaginationProvider<T>({
	children,
	pagination,
}: {
	children: React.ReactNode;
	pagination: ReturnType<typeof usePagination>;
}) {
	return <PaginationContext.Provider value={pagination}>{children}</PaginationContext.Provider>;
}

function PaginationButton({
	children,
	active = false,
	onClick,
}: {
	children?: React.ReactNode;
	active?: boolean;
	onClick: () => void;
}) {
	return (
		<Button
			type="button"
			size="circle"
			className={active ? "ring-ring ring-2" : ""}
			onClick={onClick}
		>
			{children}
		</Button>
	);
}

export function PaginationNextButton() {
	const { currentPage, buttons, pageButtonLimit, next } = usePaginationContext();

	if (currentPage === buttons.length) return null;
	if (buttons.length < pageButtonLimit) return null;

	return (
		<PaginationButton onClick={next}>
			<ChevronRightIcon size={14} />
		</PaginationButton>
	);
}

export function PaginationPrevButton({ showOnFirstPage = false }: { showOnFirstPage?: boolean }) {
	const { currentPage, prev } = usePaginationContext();

	if (!showOnFirstPage && currentPage === 1) return null;

	return (
		<PaginationButton onClick={prev}>
			<ChevronLeftIcon size={14} />
		</PaginationButton>
	);
}

export function PaginationNumberedButtons({ limit }: { limit?: number }) {
	const { currentPage, goto, buttons } = usePaginationContext();

	return (
		<>
			{buttons.slice(0, limit).map((page) => (
				<PaginationButton
					key={page}
					active={currentPage === page}
					onClick={() => goto(page)}
				>
					{page}
				</PaginationButton>
			))}
		</>
	);
}

export function PaginationMorePopover({
	showConditionally = true,
}: {
	showConditionally?: boolean;
}) {
	const { currentPage, goto, buttons, pageButtonLimit } = usePaginationContext();

	if (showConditionally && buttons.length <= pageButtonLimit) return null;

	return (
		<Popover
			trigger={{
				className: buttonStyles({
					className: "data-[state=open]:border-ring data-[state=open]:border-2",
					size: "circle",
				}),
				children: <MoreHorizontalIcon size={14} />,
			}}
			content={{
				align: "end",
				side: "bottom",
				className: "grid grid-cols-4 gap-2",
				children: buttons.map((page) => (
					<PaginationButton
						key={page}
						active={currentPage === page}
						onClick={() => goto(page)}
					>
						{page}
					</PaginationButton>
				)),
			}}
		/>
	);
}
