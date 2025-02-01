import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Iconify } from "../iconify";
import { closeClassName, contentClassName, overlayClassName } from "./dialog-styles";
import type { DefaultDialogProps } from "./types";

export function DefaultDialog({
	trigger,
	title,
	description,
	className,
	children,
	open,
	onOpenChange,
	defaultOpen,
	...rest
}: DefaultDialogProps) {
	return (
		<DialogPrimitive.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
			<DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className={overlayClassName} />
				<DialogPrimitive.Content className={contentClassName(className)} {...rest}>
					<div className="flex flex-col gap-1.5 text-left">
						<DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
							{title}
						</DialogPrimitive.Title>
						<DialogPrimitive.Description className="text-muted-foreground text-sm">
							{description}
						</DialogPrimitive.Description>
					</div>
					{children}
					<DialogPrimitive.Close className={closeClassName}>
						<Iconify icon="lucide:x" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
