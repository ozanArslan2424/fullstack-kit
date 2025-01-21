import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ComponentProps, useState } from "react";
import { cn } from "@/lib/cn";
import { useField } from "./field";

type InputType =
	| "text"
	| "password"
	| "email"
	| "number"
	| "file"
	| "search"
	| "tel"
	| "url"
	| "color"
	| "date"
	| "time"
	| "datetime-local"
	| "month"
	| "week";

type InputProps = Omit<ComponentProps<"input">, "name" | "id" | "type"> & {
	type: InputType;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
};

type InputStylesProps = {
	className?: string;
	isError?: boolean;
};

export function inputStyles({ className, isError }: InputStylesProps) {
	return cn(
		"input",
		"flex items-center gap-3 bg-background text-foreground border-primary/20 w-full rounded-lg border px-3 py-1.5 transition h-11",
		"hover:border-primary/50 placeholder:text-muted-foreground",
		"disabled:border-muted disabled:text-muted-foreground disabled:hover:border-muted disabled:bg-muted/20 disabled:cursor-not-allowed",
		"focus-within:hover:border-primary focus-within:border-primary focus-within:outline-none",
		isError && "border-error focus-within:border-warning focus-within:hover:border-warning",
		"[&>input]:h-full [&>input]:w-full [&>input]:flex-1 [&>input]:focus-visible:outline-none",
		className,
	);
}

export function Input({ className, type, startIcon, endIcon, ...rest }: InputProps) {
	const { name, id, register, errors } = useField();
	const error = errors[name]?.message?.toString();

	const [visible, setVisible] = useState(false);

	function changeVisible() {
		setVisible(true);
		setTimeout(() => {
			setVisible(false);
		}, 2000);
	}

	if (type === "password") {
		return (
			<div className={inputStyles({ className, isError: !!error })}>
				{startIcon}
				<input
					{...register(name)}
					{...rest}
					type={visible ? "text" : "password"}
					id={id}
					className="peer"
				/>
				<button
					type="button"
					className={cn(
						visible
							? "aspect-square rounded-lg p-1.5"
							: "focus-visible:bg-secondary/30 aspect-square rounded-lg p-1.5 focus-visible:outline-none",
					)}
					disabled={visible || rest.disabled}
					onClick={visible ? undefined : changeVisible}
				>
					{visible ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
				</button>
				{endIcon}
			</div>
		);
	}

	return (
		<div
			className={inputStyles({
				className: cn(type === "file" && "hover:border-primary/20 p-0", className),
				isError: !!error,
			})}
		>
			{startIcon}

			<input
				{...register(name)}
				{...rest}
				id={id}
				type={type}
				className={cn(
					"file:bg-secondary/50 hover:file:bg-secondary/80 file:text-foreground peer file:mr-3 file:h-full file:cursor-pointer file:rounded-l-lg file:px-5 file:font-semibold file:not-italic file:transition-all",
					type === "file" && "text-muted-foreground italic",
				)}
			/>

			{endIcon}
		</div>
	);
}
