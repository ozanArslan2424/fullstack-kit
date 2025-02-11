import { cn } from "@/lib/cn";
import { createContext, useContext, useId } from "react";
import { useFormContext } from "react-hook-form";
import type { FieldContextType } from "./types";

const FieldContext = createContext<FieldContextType | null>(null);

export const useField = () => useContext(FieldContext);

export function FieldProvider({
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
	const {
		register,
		formState: { errors, defaultValues },
	} = useFormContext();

	const genId = useId() + name;

	const error = errors[name]?.message?.toString();

	return (
		<FieldContext.Provider value={{ id: id || genId, name, error, register, defaultValues }}>
			<fieldset className={cn("w-full space-y-1", className)}>{children}</fieldset>
		</FieldContext.Provider>
	);
}
