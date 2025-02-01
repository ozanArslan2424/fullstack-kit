import { cn } from "@/lib/cn";
import { useField } from "./provider";
import { inputStyles } from "./styles/input-styles";
import { TextareaProps } from "./types";

export function Textarea({
	id,
	name,
	resize = "auto",
	isError,
	className,
	...rest
}: TextareaProps) {
	const fieldContext = useField();

	const fieldId = fieldContext?.id || id || "";
	const fieldName = fieldContext?.name || name || "";
	const fieldError = isError || !!fieldContext?.error;
	const fieldRegister = fieldContext ? fieldContext.register(fieldName) : undefined;

	return (
		<textarea
			{...rest}
			id={fieldId}
			name={fieldName}
			{...fieldRegister}
			className={inputStyles({
				isError: fieldError,
				className: cn(
					"min-h-24",
					resize === "auto" && "field-sizing-content h-max",
					resize === "none" && "field-sizing-fixed resize-none",
					resize === "both" && "resize",
					resize === "vertical" && "resize-y",
					resize === "horizontal" && "resize-x",
					className,
				),
			})}
		/>
	);
}
