import { ComponentProps } from "react";
import { FieldValues, FormProvider, FormProviderProps, SubmitHandler } from "react-hook-form";
import { cn } from "@/lib/cn";

type FormProps<T extends FieldValues> = {
	form: Omit<FormProviderProps<T>, "children">;
	onSubmit: SubmitHandler<T>;
} & Omit<ComponentProps<"form">, "onSubmit">;

export function Form<T extends FieldValues>({
	className,
	onSubmit,
	form,
	children,
	...rest
}: FormProps<T>) {
	return (
		<FormProvider {...form}>
			<form
				{...rest}
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("space-y-4", className)}
			>
				{children}
			</form>
		</FormProvider>
	);
}
