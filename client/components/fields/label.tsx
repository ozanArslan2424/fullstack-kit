import type { ComponentProps } from "react";
import { useField } from "./provider";
import { labelStyles } from "./styles/label-styles";

type ErrorMessageProps = Omit<ComponentProps<"label">, "children"> & {
	message?: string;
};

export function ErrorMessage({ className, message, ...rest }: ErrorMessageProps) {
	const fieldContext = useField();

	if (fieldContext && fieldContext.error) {
		message = fieldContext.error;
	}

	if (!message) return null;

	return (
		<label {...rest} className={labelStyles({ className, isError: true })}>
			{message}
		</label>
	);
}

export function Label({ className, htmlFor, ...rest }: ComponentProps<"label">) {
	const fieldContext = useField();

	if (!htmlFor && fieldContext) {
		htmlFor = fieldContext.id;
	}

	return <label {...rest} htmlFor={htmlFor} className={labelStyles({ className, isError: false })} />;
}
