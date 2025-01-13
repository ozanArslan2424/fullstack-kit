import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ZodError, ZodType } from "zod";
import { RequestOptions, RequestReturn, sendRequest } from "@/lib/send-request";

type Res<T> = Awaited<RequestReturn<T>>["res"];
type Data<T> = Awaited<RequestReturn<T>>["data"];

type FieldErrors<T> = ZodError<T>["formErrors"]["fieldErrors"] & { root?: string };

type UseRequestFormOptions<TValues, TData> = {
	path: ServerRoutePath;
	schema?: ZodType<TValues>;
	options?: RequestOptions;
	onSuccess?: (data: Data<TData>, res: Res<TData>) => void;
	onError?: "throw" | ((error: Error) => void);
	optimisticUpdate?: (values: TValues) => void;
};

export function useRequestForm<TValues = void, TData = any>({
	schema,
	path,
	options,
	onSuccess,
	onError,
	optimisticUpdate,
}: UseRequestFormOptions<TValues, TData>) {
	const [errors, setErrors] = useState<FieldErrors<TValues>>({});

	const { mutate, isPending } = useMutation<Awaited<RequestReturn<TData>>, Error, TValues>({
		mutationFn: (values) =>
			sendRequest(path, {
				...options,
				body: JSON.stringify(values),
				headers: { "Content-Type": "application/json" },
			}),
		onSuccess: async ({ data, res }) => {
			if (!res.ok) {
				throw new Error((data as { message: string }).message);
			}
			onSuccess?.(data, res);
		},
		onError: onError === "throw" ? undefined : onError,
		throwOnError: onError === "throw",
		onMutate: optimisticUpdate,
	});

	function safeSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		setErrors({});

		if (!schema) {
			mutate({} as TValues);
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
		const { data, error } = schema.safeParse(values);

		if (error) {
			setErrors(error.formErrors.fieldErrors);
			return;
		}

		mutate(data);
	}

	return { safeSubmit, errors, isPending };
}
