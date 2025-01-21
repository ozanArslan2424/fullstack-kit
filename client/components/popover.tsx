import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Popover({
	trigger,
	className,
	...rest
}: {
	trigger: ReactNode;
} & PopoverPrimitive.PopoverContentProps) {
	return (
		<PopoverPrimitive.Root>
			<PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					{...rest}
					className={cn(
						"bg-background text-foreground border-primary/20 z-50 h-max w-max rounded-lg border p-2 shadow-md outline-none",
						"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
						"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
						"data-[side=bottom]:slide-in-from-top-2",
						"data-[side=left]:slide-in-from-right-2",
						"data-[side=right]:slide-in-from-left-2",
						"data-[side=top]:slide-in-from-bottom-2",
						className,
					)}
				/>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Root>
	);
}
