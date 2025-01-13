import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type TooltipContentProps = ComponentProps<typeof TooltipPrimitive.Content>;

type TooltipProps = {
	tip: ReactNode;
	tipProps?: TooltipContentProps;
} & ComponentProps<typeof TooltipPrimitive.Trigger>;

export function Tooltip({ tip, tipProps, className, ...rest }: TooltipProps) {
	return (
		<TooltipPrimitive.Provider>
			<TooltipPrimitive.Root>
				<TooltipPrimitive.Trigger className={cn("default", className)} {...rest} />
				<TooltipPrimitive.Content
					className={cn(
						"bg-background text-foreground animate-in fade-in-0 zoom-in-95 z-50 overflow-hidden rounded-md border px-3 py-1.5 text-sm shadow-md",
						"data-[state=closed]:animate-out",
						"data-[state=closed]:fade-out-0",
						"data-[state=closed]:zoom-out-95",
						"data-[side=top]:slide-in-from-bottom-2",
						"data-[side=left]:slide-in-from-right-2",
						"data-[side=right]:slide-in-from-left-2",
						"data-[side=bottom]:slide-in-from-top-2",
						tipProps?.className,
					)}
					{...tipProps}
				>
					{tip}
				</TooltipPrimitive.Content>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	);
}
