import { cn } from "@/lib/cn";
import { buttonStyles } from "../button/button-styles";

export const sheetVariants = {
	top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
	bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
	left: "inset-y-0 left-0 h-full w-[75%] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-md",
	right:
		"inset-y-0 right-0 h-full w-[75%] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md",
};

export const closeClassName = buttonStyles({
	size: "icon",
	variant: "ghost",
	className:
		"text-muted-foreground hover:bg-error/70 hover:text-error-foreground absolute top-0 right-0 size-7 rounded-tl-none rounded-tr-lg rounded-br-none rounded-bl-lg border-b-2 border-l-2",
});

export const overlayClassName = cn(
	"fixed inset-0 z-50 bg-black/80",

	"data-[state=open]:animate-in",
	"data-[state=open]:fade-in-0",

	"data-[state=closed]:animate-out",
	"data-[state=closed]:fade-out-0",
);

export function contentClassName(className?: string) {
	return cn(
		"bg-modal text-modal-foreground fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200",
		"data-[state=open]:animate-in",
		"data-[state=open]:fade-in-0",
		"data-[state=open]:zoom-in-95",

		"data-[state=closed]:animate-out",
		"data-[state=closed]:fade-out-0",
		"data-[state=closed]:zoom-out-95",
		className,
	);
}
