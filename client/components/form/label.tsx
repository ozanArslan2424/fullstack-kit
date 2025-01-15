import { ComponentProps } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { useField } from "./field";

type ErrorMessageProps = Omit<ComponentProps<"label">, "htmlFor"> & {
	toastOnly?: boolean;
};

export function ErrorMessage({ className, toastOnly = false, ...rest }: ErrorMessageProps) {
	const { errors, name, id } = useField();
	const message = errors[name]?.message?.toString();

	if (toastOnly) {
		toast.error(message);
		return null;
	}

	if (!message) return null;

	return (
		<label
			{...rest}
			htmlFor={id}
			className={cn("text-error block px-1 font-semibold", className)}
		>
			{message}
		</label>
	);
}

export function Label({ className, ...rest }: Omit<ComponentProps<"label">, "htmlFor">) {
	const { id } = useField();
	return (
		<label
			{...rest}
			htmlFor={id}
			className={cn("text-foreground block px-1 font-semibold", className)}
		/>
	);
}
