import { createContext, useContext, useId } from "react";
import { FieldErrors, UseFormRegister, useFormContext } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { cn } from "@/lib/cn";

const FormFieldContext = createContext<{
	id: string;
	name: string;
	register: UseFormRegister<FieldValues>;
	errors: FieldErrors<FieldValues>;
} | null>(null);

export function useField() {
	const context = useContext(FormFieldContext);
	if (!context) {
		throw new Error("useField must be used within a Field");
	}
	return context;
}

export function FormField({
	id,
	name,
	children,
	className,
}: {
	id: string;
	name: string;
	children: React.ReactNode;
	className?: string;
}) {
	const formContext = useFormContext();
	const genId = useId() + name;

	if (!formContext) {
		throw new Error("Field must be used within a Form");
	}

	const {
		formState: { errors },
		register,
	} = formContext;

	return (
		<FormFieldContext.Provider value={{ id: id || genId, name, errors, register }}>
			<fieldset className={cn("w-full space-y-1", className)}>{children}</fieldset>
		</FormFieldContext.Provider>
	);
}
