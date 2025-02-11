import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FieldValues, UseFormProps, useForm as useReactHookForm } from "react-hook-form";
import { ZodType } from "zod";
import { RequestMethod, RequestOptions, sendRequest } from "@/lib/send-request";

export function useRequestForm<TValues extends FieldValues, TData = any>(
	form: {
		schema: ZodType<TValues>;
	} & UseFormProps<TValues>,
	request: {
		path: ServerRoutePath;
		method: RequestMethod;
		onSuccess?: (data: TData) => void;
		onError?: (error: Error) => void;
		onElse?: (values: TValues) => void;
	} & RequestOptions,
) {
	const { schema, ...formRest } = form;

	const formObj = useReactHookForm<TValues>({
		...formRest,
		resolver: zodResolver(schema),
	});

	const { path, method, onSuccess, onError, onElse, ...requestRest } = request;

	const { mutate, isPending } = useMutation<TData, Error, TValues>({
		mutationFn: async (values) => {
			const res = await sendRequest<TValues>(path, method, values, { ...requestRest });
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);
			return data;
		},
		onSettled: (data, error, values) => {
			onElse?.(values);

			if (error) {
				console.error(`🔴 useRequest ${path} error: `, error);
				onError?.(error);
				return;
			}

			if (data) {
				onSuccess?.(data);
				return;
			}
		},
	});

	return {
		form: formObj,
		handleSubmit: (values: TValues) => mutate(values),
		isPending,
	};
}
