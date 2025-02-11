import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";
import type { FieldValues, FormProviderProps, SubmitHandler } from "react-hook-form";
import { FormProvider } from "react-hook-form";

type FormProps<T extends FieldValues> = {
	form: Omit<FormProviderProps<T>, "children">;
	onSubmit: SubmitHandler<T>;
} & Omit<ComponentProps<"form">, "onSubmit">;

export function Form<T extends FieldValues>({ className, onSubmit, form, children, ...rest }: FormProps<T>) {
	return (
		<FormProvider {...form}>
			<form {...rest} onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
				{children}
			</form>
		</FormProvider>
	);
}
