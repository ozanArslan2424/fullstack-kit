import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ZodError, ZodType } from "zod";

export type UseMutationFormOptions<T, R> = {
	schema?: ZodType<T>;
	mutationFn: (values: T) => R | Promise<R>;
} & UseMutationOptions<R, Error, T, unknown>;

type FieldErrors<T> = ZodError<T>["formErrors"]["fieldErrors"] & { root?: string };

export function useForm<T = any, R = void>({
	schema,
	mutationFn,
	...options
}: UseMutationFormOptions<T, R>) {
	const [errors, setErrors] = useState<FieldErrors<T>>({});

	const { mutate, isPending } = useMutation({
		mutationFn: async (values: T) => mutationFn(values),
		onError: (e, v, c) => {
			if (e instanceof ZodError) {
				setErrors(e.formErrors.fieldErrors);
			} else {
				setErrors({ ...errors, root: e.message });
			}
			options.onError?.(e, v, c);
		},
		...options,
	});

	function safeSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		setErrors({});

		if (!schema) {
			mutate({} as T);
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

		mutate(data);
	}

	return { errors, safeSubmit, isPending };
}
