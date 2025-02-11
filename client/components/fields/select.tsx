import { Iconify } from "../iconify";
import { useField } from "./provider";
import { selectStyles } from "./styles/select-styles";
import type { SelectProps } from "./types";

export function Select({ id, name, className, isError, options, ...rest }: SelectProps) {
	const fieldContext = useField();

	const fieldId = fieldContext?.id || id || "";
	const fieldName = fieldContext?.name || name || "";
	const fieldError = isError || !!fieldContext?.error;
	const fieldRegister = fieldContext ? fieldContext.register(fieldName) : undefined;

	return (
		<div className={selectStyles({ className, isError })}>
			<span className="text-foreground pointer-events-none absolute top-[50%] right-3 z-10 -translate-y-[50%]">
				<Iconify icon="lucide:chevron-down" />
			</span>
			<select id={fieldId} name={fieldName} {...rest}>
				{options.map(({ label, value }) => (
					<option key={value} value={value}>
						{label}
					</option>
				))}
			</select>
		</div>
	);
}
