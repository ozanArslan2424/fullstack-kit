import { ChevronDown } from "lucide-react";
import { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { useField } from "./field";

type SelectProps = {
	options: { label: string; value: string }[];
} & Omit<ComponentProps<"select">, "name" | "id">;

type SelectStylesProps = {
	className?: string;
	isError?: boolean;
};

export function selectStyles({ className, isError }: SelectStylesProps = {}) {
	return cn(
		"relative flex cursor-pointer items-center ",
		"bg-background text-foreground border-primary/20 h-11 w-full rounded-lg border transition",
		"hover:border-primary/50 placeholder:text-muted-foreground",
		"disabled:border-muted disabled:text-muted-foreground disabled:hover:border-muted disabled:bg-muted/20 disabled:cursor-not-allowed",
		"focus-within:hover:border-primary focus-within:border-primary focus-within:outline-none",
		isError && "border-error focus-within:border-warning focus-within:hover:border-warning",
		"[&>select]:pr-8 [&>select]:min-w-max [&>select]:h-full [&>select]:w-full [&>select]:grow [&>select]:cursor-pointer [&>select]:appearance-none [&>select]:rounded-lg [&>select]:border [&>select]:bg-transparent [&>select]:pl-3 [&>select]:py-1.5 [&>select]:focus-visible:outline-none",
		className,
	);
}

export function CustomSelectChevron() {
	return (
		<ChevronDown className="text-foreground pointer-events-none absolute right-2 top-[50%] z-10 -translate-y-[50%]" />
	);
}

export function Select({ className, options, ...rest }: SelectProps) {
	const { errors, id, name, register } = useField();
	const error = errors[name]?.message?.toString();

	return (
		<div className={selectStyles({ className, isError: !!error })}>
			<CustomSelectChevron />
			<select {...register(name)} {...rest} id={id}>
				{options.map(({ label, value }) => (
					<option key={value} value={value}>
						{label}
					</option>
				))}
			</select>
		</div>
	);
}
