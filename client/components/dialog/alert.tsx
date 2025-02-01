import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { buttonStyles } from "../button/button-styles";
import { contentClassName, overlayClassName } from "./dialog-styles";
import type { AlertDialogProps } from "./types";

export function AlertDialog({
	trigger,
	title,
	description,
	className,
	children,
	action,
	cancel,
}: AlertDialogProps) {
	const {
		className: cancelClassName,
		children: cancelChildren = "Cancel",
		...cancelProps
	} = cancel;
	const { className: actionClassName, ...actionProps } = action;
	return (
		<AlertDialogPrimitive.Root>
			<AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>
			<AlertDialogPrimitive.Portal>
				<AlertDialogPrimitive.Overlay className={overlayClassName} />
				<AlertDialogPrimitive.Content className={contentClassName(className)}>
					<div className="flex flex-col gap-1.5 text-left">
						<AlertDialogPrimitive.Title>{title}</AlertDialogPrimitive.Title>
						<AlertDialogPrimitive.Description>
							{description}
						</AlertDialogPrimitive.Description>
					</div>
					{children}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2">
						<AlertDialogPrimitive.Cancel
							{...cancelProps}
							className={buttonStyles({ className: cancelClassName })}
						>
							{cancelChildren}
						</AlertDialogPrimitive.Cancel>
						<AlertDialogPrimitive.Action
							{...actionProps}
							className={buttonStyles({ className: actionClassName })}
						/>
					</div>
				</AlertDialogPrimitive.Content>
			</AlertDialogPrimitive.Portal>
		</AlertDialogPrimitive.Root>
	);
}
