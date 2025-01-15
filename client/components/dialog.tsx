import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronsLeftIcon, XIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import React from "react";
import { cn } from "@/lib/cn";
import { buttonStyles } from "./button";

type SheetDialogProps = {
	trigger: ReactNode;
	title: string;
	description: string;
	className?: string;
	children?: React.ReactNode;
	open?: ComponentProps<typeof DialogPrimitive.Root>["open"];
	onOpenChange?: ComponentProps<typeof DialogPrimitive.Root>["onOpenChange"];
	defaultOpen?: ComponentProps<typeof DialogPrimitive.Root>["defaultOpen"];
	side?: "top" | "bottom" | "left" | "right";
} & ComponentProps<typeof DialogPrimitive.Content>;

type AlertDialogProps = {
	trigger: ReactNode;
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
	| ({ variant: "dialog" } & DialogProps)
	| ({ variant: "sheet" } & SheetDialogProps);

const sheetVariants = {
	top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
	bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
	left: "inset-y-0 left-0 h-full w-[75%] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-md",
	right: "inset-y-0 right-0 h-full w-[75%] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md",
};
const closeClassName =
	"icon-sm text-muted-foreground hover:bg-error/30 absolute top-0 right-0 size-7 rounded-tl-none rounded-tr-lg rounded-br-none rounded-bl-lg border-b-2 border-l-2";
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

function NormalDialog({
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
						<DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
							{title}
						</DialogPrimitive.Title>
						<DialogPrimitive.Description className="text-muted-foreground text-sm">
							{description}
						</DialogPrimitive.Description>
					</div>
					{children}
					<DialogPrimitive.Close className={closeClassName}>
						<XIcon strokeWidth={3} />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}

function AlertDialog({
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

function SheetDialog({
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
						<DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-wide">
							{title}
						</DialogPrimitive.Title>
						<DialogPrimitive.Description className="text-muted-foreground">
							{description}
						</DialogPrimitive.Description>
					</div>
					{children}
					<DialogPrimitive.Close
						className={
							"default absolute right-2 top-2 aspect-square cursor-pointer rounded-none p-2 text-xs transition-all hover:opacity-70"
						}
					>
						<ChevronsLeftIcon strokeWidth={3} className="h-5 w-5" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}

export function Dialog({ variant = "dialog", ...rest }: CombinedDialogProps) {
	if (variant === "sheet") {
		return <SheetDialog {...(rest as SheetDialogProps)} />;
	}

	if (variant === "alert") {
		return <AlertDialog {...(rest as AlertDialogProps)} />;
	}

	return <NormalDialog {...(rest as DialogProps)} />;
}
