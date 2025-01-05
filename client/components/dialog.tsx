import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/client/utils/cn";

type AlertDialogProps = {
	trigger: ComponentProps<typeof AlertDialogPrimitive.Trigger>;
	title: string;
	description: string;
	className?: string;
	children?: React.ReactNode;
	action: ComponentProps<typeof AlertDialogPrimitive.Action>;
	cancel: ComponentProps<typeof AlertDialogPrimitive.Cancel>;
};

type DialogProps = {
	trigger: ReactNode;
	title: string;
	description: string;
	open?: ComponentProps<typeof DialogPrimitive.Root>["open"];
	onOpenChange?: ComponentProps<typeof DialogPrimitive.Root>["onOpenChange"];
	defaultOpen?: ComponentProps<typeof DialogPrimitive.Root>["defaultOpen"];
} & ComponentProps<typeof DialogPrimitive.Content>;

type CombinedDialogProps =
	| ({ variant: "alert" } & AlertDialogProps)
	| ({ variant: "dialog" } & DialogProps);

const overlayClassName = cn(
	"fixed inset-0 z-50 bg-black/80",

	"data-[state=open]:animate-in",
	"data-[state=open]:fade-in-0",

	"data-[state=closed]:animate-out",
	"data-[state=closed]:fade-out-0",
);

const contentClassName = (className?: string) =>
	cn(
		"bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200",
		"data-[state=open]:animate-in",
		"data-[state=open]:fade-in-0",
		"data-[state=open]:zoom-in-95",

		"data-[state=closed]:animate-out",
		"data-[state=closed]:fade-out-0",
		"data-[state=closed]:zoom-out-95",
		className,
	);

export function NormalDialog({
	trigger,
	title,
	description,
	className,
	children,
	open,
	onOpenChange,
	defaultOpen,
	...rest
}: DialogProps) {
	return (
		<DialogPrimitive.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
			<DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className={overlayClassName} />
				<DialogPrimitive.Content className={contentClassName(className)} {...rest}>
					<div className="flex flex-col gap-1.5 text-left">
						<DialogPrimitive.Title className="text-lg leading-none font-semibold tracking-tight">
							{title}
						</DialogPrimitive.Title>
						<DialogPrimitive.Description className="text-muted-foreground text-sm">
							{description}
						</DialogPrimitive.Description>
					</div>
					{children}
					<DialogPrimitive.Close className="icon-sm text-muted-foreground hover:bg-error/30 absolute top-0 right-0 size-7 rounded-tl-none rounded-tr-lg rounded-br-none rounded-bl-lg border-b-2 border-l-2">
						<XIcon strokeWidth={3} />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}

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
			<AlertDialogPrimitive.Trigger {...trigger} />
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
							className={cn("button", cancelClassName)}
						>
							{cancelChildren}
						</AlertDialogPrimitive.Cancel>
						<AlertDialogPrimitive.Action
							{...actionProps}
							className={cn("button", actionClassName)}
						/>
					</div>
				</AlertDialogPrimitive.Content>
			</AlertDialogPrimitive.Portal>
		</AlertDialogPrimitive.Root>
	);
}

export function Dialog({ variant = "dialog", ...rest }: CombinedDialogProps) {
	return variant === "alert" ? (
		<AlertDialog {...(rest as AlertDialogProps)} />
	) : (
		<NormalDialog {...(rest as DialogProps)} />
	);
}
