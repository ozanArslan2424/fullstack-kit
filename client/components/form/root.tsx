import { ComponentProps } from "react";
import {
	FieldValues,
	FormProvider,
	FormProviderProps,
	SubmitHandler,
	useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/cn";

type FormProps<T extends FieldValues> = {
	onSubmit: SubmitHandler<T>;
	className?: string;
} & FormProviderProps<T>;

export function Form<T extends FieldValues>({
	children,
	className,
	onSubmit,
	...rest
}: FormProps<T>) {
	return (
		<FormProvider {...rest}>
			<FormElement className={className} onSubmit={onSubmit}>
				{children}
			</FormElement>
		</FormProvider>
	);
}

function FormElement<T extends FieldValues>({
	className,
	onSubmit,
	...rest
}: Omit<ComponentProps<"form">, "onSubmit"> & {
	onSubmit: SubmitHandler<T>;
}) {
	const { handleSubmit } = useFormContext<T>();

	return (
		<form {...rest} onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)} />
	);
}
