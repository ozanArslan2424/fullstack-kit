import { cn } from "@/lib/cn";

export function inputStyles({ className, isError }: { className?: string; isError?: boolean }) {
	return cn(
		"input",
		"flex items-center gap-3 bg-background text-foreground border-primary/20 w-full rounded-lg border px-3 py-1.5 transition h-11",
		"hover:border-primary/50 placeholder:text-muted-foreground",
		"disabled:border-muted disabled:text-muted-foreground disabled:hover:border-muted disabled:bg-muted/20 disabled:cursor-not-allowed",
		"focus-within:hover:border-primary focus-within:border-primary focus-within:outline-none",
		isError && "border-error focus-within:border-warning focus-within:hover:border-warning",
		"[&>input]:h-full [&>input]:w-full [&>input]:flex-1 [&>input]:focus-visible:outline-none",
		className,
	);
}
