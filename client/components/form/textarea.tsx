import { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { useField } from "./field";

type TextareaProps = Omit<ComponentProps<"textarea">, "name" | "id"> & {};

export function Textarea({ className, ...rest }: TextareaProps) {
	const { name, id, register, errors } = useField();
	const error = errors[name]?.message?.toString();

	return (
		<textarea
			{...register(name)}
			{...rest}
			id={id}
			className={cn(
				"bg-background text-foreground border-primary/20 min-h-40 w-full rounded-lg border px-3 py-1.5 transition",
				"hover:border-primary/50 placeholder:text-muted-foreground",
				"disabled:border-muted disabled:text-muted-foreground disabled:hover:border-muted disabled:bg-muted/20 disabled:cursor-not-allowed",
				"focus-visible:hover:border-primary focus-visible:border-primary focus-visible:outline-none",
				!!error &&
					"border-error focus-visible:border-warning focus-visible:hover:border-warning",
				className,
			)}
		/>
	);
}
