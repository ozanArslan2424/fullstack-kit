import { createContext, useContext } from "react";
import { Button } from "../button";
import { Iconify } from "../iconify";
import { Popover, PopoverSlot } from "../modal/popover";
import { usePagination } from "./use-pagination";

const PaginationContext = createContext<ReturnType<typeof usePagination> | null>(null);

function usePaginationContext() {
	const context = useContext(PaginationContext);
	if (!context) {
		throw new Error("usePaginationContext must be used within a PaginationProvider");
	}
	return context;
}

export function PaginationProvider({
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
			<Iconify icon="lucide:chevrons-right" />
		</PaginationButton>
	);
}

export function PaginationPrevButton({ showOnFirstPage = false }: { showOnFirstPage?: boolean }) {
	const { currentPage, prev } = usePaginationContext();

	if (!showOnFirstPage && currentPage === 1) return null;

	return (
		<PaginationButton onClick={prev}>
			<Iconify icon="lucide:chevrons-left" />
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
		<Popover>
			<PopoverSlot.Trigger>
				<Button
					size="circle"
					className="data-[state=open]:border-ring data-[state=open]:border-2"
				>
					<Iconify icon="lucide:more-vertical" />
				</Button>
			</PopoverSlot.Trigger>

			<PopoverSlot.Content align="end" side="bottom" className="grid grid-cols-4 gap-2">
				{buttons.map((page) => (
					<PaginationButton
						key={page}
						active={currentPage === page}
						onClick={() => goto(page)}
					>
						{page}
					</PaginationButton>
				))}
			</PopoverSlot.Content>
		</Popover>
	);
}
