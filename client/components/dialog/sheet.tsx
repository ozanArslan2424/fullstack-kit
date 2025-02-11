import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";
import { Iconify } from "../iconify";
import { overlayClassName, sheetVariants } from "./dialog-styles";
import type { SheetDialogProps } from "./types";

export function SheetDialog({
	title,
	description,
	children,
	className,
	trigger,
	onOpenChange,
	open,
	defaultOpen,
	side = "left",
	...props
}: SheetDialogProps) {
	return (
		<DialogPrimitive.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
			<DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className={overlayClassName} />
				<DialogPrimitive.Content
					className={cn(
						"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-8 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
						sheetVariants[side],
						className,
					)}
					{...props}
				>
					<div className="flex flex-col gap-4 pb-4">
						<DialogPrimitive.Title className="text-lg leading-none font-semibold tracking-wide">
							{title}
						</DialogPrimitive.Title>
						<DialogPrimitive.Description className="text-muted-foreground">{description}</DialogPrimitive.Description>
					</div>
					{children}
					<DialogPrimitive.Close
						className={
							"default absolute top-2 right-2 aspect-square cursor-pointer rounded-none p-2 text-xs transition-all hover:opacity-70"
						}
					>
						<Iconify icon="lucide:chevrons-left" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
