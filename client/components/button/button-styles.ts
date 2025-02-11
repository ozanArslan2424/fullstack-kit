import { cn } from "@/lib/cn";
import type { ButtonStyleProps } from "./types";

export const buttonVariants = {
	outline: "text-foreground hover:bg-muted/10 active:bg-muted/5 border-primary/20 bg-transparent",
	ghost: "text-foreground hover:bg-muted/40 active:bg-muted/20 border-transparent bg-transparent",
	primary: "border-primary bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
	secondary: "border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80",
	info: "border-info bg-info text-info-foreground hover:bg-info/90 active:bg-info/80",
	success: "border-success bg-success text-success-foreground hover:bg-success/90 active:bg-success/80",
	warning: "border-warning bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80",
	error: "border-error bg-error text-error-foreground hover:bg-error/90 active:bg-error/80",
};

export const buttonSizes = {
	sm: "gap-3 rounded-md px-3 py-1.5 text-sm",
	md: "h-11 gap-3 rounded-lg px-4 py-2 text-base",
	lg: "h-14 gap-4 rounded-md px-6 py-2 text-base",
	icon: "aspect-square p-2 min-w-8 min-h-8 rounded-sm text-sm overflow-clip shrink-0",
	icon_md: "aspect-square w-11 h-11 rounded-md overflow-clip shrink-0",
	icon_lg: "aspect-square w-14 h-14 rounded-lg overflow-clip shrink-0",
	circle: "aspect-square p-2 min-w-8 min-h-8 rounded-full text-sm overflow-clip shrink-0",
	circle_md: "aspect-square w-11 h-11 rounded-full overflow-clip shrink-0",
	circle_lg: "aspect-square w-14 h-14 rounded-full overflow-clip shrink-0",
};

export function buttonStyles({ variant = "outline", size = "md", className }: ButtonStyleProps) {
	return cn(
		"inline-flex items-center justify-center",
		"disabled:bg-muted/50 disabled:text-muted-foreground shrink-0 cursor-pointer border font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:border-transparent",
		"focus-visible:ring-ring transition focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		"[&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
		buttonVariants[variant],
		buttonSizes[size],
		className,
	);
}
