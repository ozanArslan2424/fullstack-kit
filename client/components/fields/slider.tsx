import { useState } from "react";
import { cn } from "@/lib/cn";
import { useField } from "./provider";
import { inputStyles } from "./styles/input-styles";
import type { SliderProps } from "./types";

export function Slider({ className, value, onChange, isError, id, name, min, max, ...rest }: SliderProps) {
	const [internalValue, setInternalValue] = useState(rest.defaultValue || value);

	const fieldContext = useField();

	const fieldId = fieldContext?.id || id || "";
	const fieldName = fieldContext?.name || name || "";
	const fieldError = isError || !!fieldContext?.error;
	const fieldRegister = fieldContext ? fieldContext.register(fieldName) : undefined;

	return (
		<div
			className={inputStyles({
				className: cn("pl-1.5", className),
				isError: fieldError,
			})}
		>
			<div className="bg-primary/10 flex aspect-square h-8 w-8 items-center justify-center rounded-md text-sm font-bold">
				<span>{internalValue}</span>
			</div>

			<input
				id={fieldId}
				name={fieldName}
				{...fieldRegister}
				type="range"
				min={min}
				max={max}
				value={value}
				onChange={(e) => {
					setInternalValue(e.target.value);
					onChange?.(e);
				}}
				{...rest}
			/>
		</div>
	);
}
