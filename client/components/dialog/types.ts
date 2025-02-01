import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps, ReactNode } from "react";

export type SheetDialogProps = {
	trigger: ReactNode;
	title: string;
	description: string;
	className?: string;
	children?: ReactNode;
	open?: ComponentProps<typeof DialogPrimitive.Root>["open"];
	onOpenChange?: ComponentProps<typeof DialogPrimitive.Root>["onOpenChange"];
	defaultOpen?: ComponentProps<typeof DialogPrimitive.Root>["defaultOpen"];
	side?: "top" | "bottom" | "left" | "right";
} & ComponentProps<typeof DialogPrimitive.Content>;

export type AlertDialogProps = {
	trigger: ReactNode;
	title: string;
	description: string;
	className?: string;
	children?: ReactNode;
	action: ComponentProps<typeof AlertDialogPrimitive.Action>;
	cancel: ComponentProps<typeof AlertDialogPrimitive.Cancel>;
};

export type DefaultDialogProps = {
	trigger: ReactNode;
	title: string;
	description: string;
	open?: ComponentProps<typeof DialogPrimitive.Root>["open"];
	onOpenChange?: ComponentProps<typeof DialogPrimitive.Root>["onOpenChange"];
	defaultOpen?: ComponentProps<typeof DialogPrimitive.Root>["defaultOpen"];
} & ComponentProps<typeof DialogPrimitive.Content>;

export type CombinedDialogProps =
	| ({ variant: "alert" } & AlertDialogProps)
	| ({ variant: "dialog" } & DefaultDialogProps)
	| ({ variant: "sheet" } & SheetDialogProps);
