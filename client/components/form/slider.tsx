import { ComponentProps, useState } from "react";
import { cn } from "@/lib/cn";
import { useField } from "./field";
import { inputStyles } from "./input";

type SliderProps = Omit<ComponentProps<"input">, "name" | "id" | "type"> & {};

export function Slider({ className, value, onChange, ...rest }: SliderProps) {
	const { name, id, register, errors } = useField();
	const error = errors[name]?.message?.toString();

	const [visible, setVisible] = useState(false);

	const [internalValue, setInternalValue] = useState(rest.defaultValue || value);

	function changeVisible() {
		setVisible(true);
		setTimeout(() => {
			setVisible(false);
		}, 2000);
	}

	return (
		<div
			className={inputStyles({
				className: cn("pl-1.5", className),
				isError: !!error,
			})}
		>
			<div className="bg-primary/10 flex aspect-square h-8 w-8 items-center justify-center rounded-md text-sm font-bold">
				<span>{internalValue}</span>
			</div>

			<input
				{...register(name)}
				{...rest}
				id={id}
				type="range"
				value={value}
				onChange={(e) => {
					setInternalValue(e.target.value);
					onChange?.(e);
				}}
			/>
		</div>
	);
}
