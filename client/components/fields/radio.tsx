import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/cn";
import { useField } from "./provider";
import type { RadioContextProps, RadioGroupProps, RadioItemProps } from "./types";

const RadioContext = createContext<RadioContextProps | null>(null);

export function RadioGroup({ children, name, defaultValue, ...rest }: RadioGroupProps) {
	const [selected, setSelected] = useState(defaultValue);

	const fieldContext = useField();

	const fieldName = fieldContext?.name || name || "";

	return (
		<RadioContext.Provider
			value={{
				name: fieldName,
				selected,
				setSelected,
				defaultValue,
			}}
		>
			<fieldset role="radiogroup" {...rest}>
				{children}
			</fieldset>
		</RadioContext.Provider>
	);
}

export function RadioItem({
	children,
	id,
	value,
	disabled,
	className,
	wrapperClassName,
	isError,
	...rest
}: RadioItemProps) {
	const context = useContext(RadioContext);
	if (!context) {
		throw new Error("RadioItem must be used within a RadioProvider");
	}

	const { name, selected, setSelected, defaultValue } = context;

	const fieldContext = useField();

	const fieldId = fieldContext?.id + name || id || "";
	const fieldError = isError || !!fieldContext?.error;
	const fieldRegister = fieldContext ? fieldContext.register(name) : undefined;

	return (
		<>
			<input
				{...rest}
				type="radio"
				id={fieldId}
				name={name}
				{...fieldRegister}
				value={value}
				checked={selected === value}
				disabled={disabled}
				className="hidden"
				readOnly
			/>
			<label className={cn("flex items-center gap-3 px-1", disabled && "text-muted-foreground", wrapperClassName)}>
				<button
					role="radio"
					type="button"
					onClick={() => setSelected(value)}
					disabled={disabled}
					aria-checked={selected === value}
					className={cn(
						"ring-primary flex h-2.5 w-2.5 items-center justify-center rounded-full ring ring-offset-2 transition-colors",
						"focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none",
						selected === value ? "ring-primary bg-primary" : "ring-muted",
						disabled && "ring-muted",
						fieldError && "ring-error",
						className,
					)}
				/>
				{children}
			</label>
		</>
	);
}
