import { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = {
	outline: "text-foreground hover:bg-muted/10 active:bg-muted/5 border-primary/20 bg-transparent",
	ghost: "text-foreground hover:bg-muted/10 active:bg-muted/5 border-transparent bg-transparent",
	primary:
		"border-primary bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
	secondary:
		"border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80",
	info: "border-info bg-info text-info-foreground hover:bg-info/90 active:bg-info/80",
	success:
		"border-success bg-success text-success-foreground hover:bg-success/90 active:bg-success/80",
	warning:
		"border-warning bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80",
	error: "border-error bg-error text-error-foreground hover:bg-error/90 active:bg-error/80",
};

const buttonSizes = {
	sm: "gap-1.5 rounded-md px-3.5 py-2 text-sm",
	md: "h-11 gap-2 rounded-lg px-4 py-2 text-base",
	lg: "h-14 gap-3 rounded-md px-6 py-2 text-base",
	icon: "aspect-square size-8 rounded-sm text-sm overflow-clip",
	icon_md: "aspect-square size-11 rounded-md overflow-clip",
	icon_lg: "aspect-square size-14 rounded-lg overflow-clip",
	circle: "aspect-square size-8 rounded-full text-sm overflow-clip",
	circle_md: "aspect-square size-11 rounded-full overflow-clip",
	circle_lg: "aspect-square size-14 rounded-full overflow-clip",
};

type ButtonStyleProps = {
	variant?: keyof typeof buttonVariants;
	size?: keyof typeof buttonSizes;
	className?: string;
};

export const buttonStyles = ({ variant = "outline", size = "md", className }: ButtonStyleProps) =>
	cn(
		"inline-flex items-center justify-center",
		"disabled:bg-muted/50 disabled:text-muted-foreground shrink-0 cursor-pointer border font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:border-transparent",
		"focus-visible:ring-ring transition focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		"[&svg]:pointer-events-none [&svg]:size-4 [&svg]:shrink-0",
		buttonVariants[variant],
		buttonSizes[size],
		className,
	);

type ButtonProps = {} & Omit<ComponentProps<"button">, "className"> & ButtonStyleProps;

export function Button({ variant = "outline", size = "md", className, ...rest }: ButtonProps) {
	return <button {...rest} className={buttonStyles({ variant, size, className })} />;
}
