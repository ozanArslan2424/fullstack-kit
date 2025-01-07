import { useState } from "react";
import { ZodError, ZodType } from "zod";

export type UseFormOptions<T, R> = {
	schema?: ZodType<T>;
	next: (values: T) => R | Promise<R>;
};

type FieldErrors<T> = ZodError<T>["formErrors"]["fieldErrors"] & { root?: string };

export function useForm<T = any, R = void>({ schema, next }: UseFormOptions<T, R>) {
	const [errors, setErrors] = useState<FieldErrors<T>>({});

	function safeSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		setErrors({});

		if (!schema) {
			next({} as T);
			return;
		}

		const formData = new FormData(e.currentTarget);
		const faultyValues = Object.fromEntries(formData);
		const values = Object.fromEntries(
			Object.entries(faultyValues).map(([key, value]) => {
				if (value instanceof File) {
					if (value.size === 0 || value.name === "") {
						return [key, undefined];
					} else {
						return [key, value];
					}
				} else {
					return [key, value];
				}
			}),
		);
		const parseResult = schema.safeParse(values);
		const { success, data, error } = parseResult;

		if (!success) {
			setErrors(error.formErrors.fieldErrors);
			return;
		}

		next(data);
	}

	return { errors, safeSubmit };
}
