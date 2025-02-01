import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Popover({ children, ...rest }: ComponentProps<typeof PopoverPrimitive.Root>) {
	return <PopoverPrimitive.Root {...rest}>{children}</PopoverPrimitive.Root>;
}

export const PopoverSlot = {
	Trigger,
	Content,
} as const;

function Trigger({ children }: { children: ReactNode }) {
	return <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>;
}

function Content({
	children,
	className,
	align = "start",
	side = "bottom",
	sideOffset = 5,
	...rest
}: {
	children: ReactNode;
} & PopoverPrimitive.PopoverContentProps) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				{...rest}
				align={align}
				side={side}
				sideOffset={sideOffset}
				className={cn(
					"bg-modal text-modal-foreground border-primary/20 z-50 h-max w-max rounded-lg border p-2.5 shadow-lg outline-none",
					"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
					"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
					"data-[side=bottom]:slide-in-from-top-2",
					"data-[side=left]:slide-in-from-right-2",
					"data-[side=right]:slide-in-from-left-2",
					"data-[side=top]:slide-in-from-bottom-2",
					className,
				)}
			>
				{children}
			</PopoverPrimitive.Content>
		</PopoverPrimitive.Portal>
	);
}
