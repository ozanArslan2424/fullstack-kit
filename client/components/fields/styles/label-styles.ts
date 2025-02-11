import { cn } from "@/lib/cn";

export function labelStyles({ className, isError }: { className?: string; isError?: boolean }) {
	return cn(" block px-1 font-semibold", isError ? "text-error" : "text-foreground", className);
}
