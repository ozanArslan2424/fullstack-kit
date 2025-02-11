import { cn } from "@/lib/cn";
import type { DateFormat, TimeFormat } from "../types";
import { inputStyles } from "./input-styles";

export function datetimePickerStyles({ className, isError }: { className?: string; isError?: boolean }) {
	return inputStyles({
		className: cn("selection:text-foreground w-fit gap-1.5 py-2.5 pl-3 pr-1.5 selection:bg-transparent", className),
		isError,
	});
}

export function dateGroupInputStyles(unit: DateFormat | TimeFormat) {
	return inputStyles({
		className: cn(
			"focus:bg-foreground/20 box-content inline h-fit min-w-8 select-none rounded-sm border-none p-1 text-center tabular-nums caret-transparent outline-none focus-visible:outline-none focus-visible:ring-0",
			unit === "years" && "min-w-10",
			unit === "am/pm" && "bg-foreground/15",
		),
	});
}
