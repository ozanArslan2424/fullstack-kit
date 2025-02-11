import { cn } from "@/lib/cn";
import { useMemo, useState } from "react";
import { useField } from "./provider";
import { inputStyles } from "./styles/input-styles";
import type { InputProps } from "./types";

export function Input({ type, id, name, className, isError, startIcon, endIcon, ...rest }: InputProps) {
	const [controlledType, setControlledType] = useState(type);

	const fieldContext = useField();

	const fieldId = fieldContext?.id || id || "";
	const fieldName = fieldContext?.name || name || "";
	const fieldError = isError || !!fieldContext?.error;
	const fieldRegister = fieldContext ? fieldContext.register(fieldName) : undefined;

	function changeVisible() {
		setControlledType("text");
		setTimeout(() => {
			setControlledType(type);
		}, 2000);
	}

	const visible = useMemo(() => type === "password" && controlledType === "text", [type, controlledType]);

	const typeOptions = [
		"text",
		"password",
		"email",
		"number",
		"file",
		"search",
		"tel",
		"url",
		"color",
		"date",
		"time",
		"datetime-local",
		"month",
		"week",
	];

	if (!typeOptions.includes(type)) {
		throw new Error(
			`Invalid Input type: "${type}"\n\nPlease use one of the following types:\n - ${typeOptions.join("\n - ")}`,
		);
	}

	return (
		<div
			className={inputStyles({
				className: cn(type === "file" && "hover:border-primary/20 p-0", className),
				isError: fieldError,
			})}
		>
			{startIcon}

			<input
				{...rest}
				id={fieldId}
				name={fieldName}
				{...fieldRegister}
				type={controlledType}
				className={cn(
					"file:bg-secondary/50 hover:file:bg-secondary/80 file:text-foreground peer file:mr-3 file:h-full file:cursor-pointer file:rounded-l-lg file:px-5 file:font-semibold file:not-italic file:transition-all",
					type === "file" && "text-muted-foreground italic",
					type === "password" && "pr-0",
				)}
			/>

			{type === "password" && (
				<button
					type="button"
					className={cn(
						"aspect-square rounded-lg p-1.5",
						visible && "focus-visible:bg-secondary/30 focus-visible:outline-none",
					)}
					disabled={visible || rest.disabled}
					onClick={changeVisible}
				>
					{visible ? <EyeOff /> : <Eye />}
				</button>
			)}

			{endIcon}
		</div>
	);
}

const Eye = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
			<path d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0" />
			<circle cx="12" cy="12" r="3" />
		</g>
	</svg>
);

const EyeOff = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
			<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242" />
			<path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20" />
		</g>
	</svg>
);
