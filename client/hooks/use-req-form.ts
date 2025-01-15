import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { DefaultValues, FieldValues, useForm as useReactHookForm } from "react-hook-form";
import { ZodType } from "zod";
import { RequestMethod, RequestOptions, sendRequest } from "@/lib/send-request";

type Res<T> = Awaited<ReturnType<typeof sendRequest<T>>>["res"];
type Data<T> = Awaited<ReturnType<typeof sendRequest<T>>>["data"];

export function useRequestForm<TValues extends FieldValues, TData = unknown>({
	path,
	schema,
	method,
	options,
	onSuccess,
	onError,
	optimisticUpdate,
	defaultValues,
}: {
	path: ServerRoutePath;
	schema: ZodType<TValues>;
	method: RequestMethod;
	options?: RequestOptions;
	onSuccess?: (data: Data<TData>, res: Res<TData>) => void;
	onError?: "throw" | ((error: Error) => void);
	optimisticUpdate?: (values: TValues) => void;
	defaultValues?: DefaultValues<TValues> | undefined;
}) {
	const form = useReactHookForm<TValues>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const { mutate, isPending } = useMutation({
		mutationFn: (values) =>
			sendRequest(path, {
				method,
				body: JSON.stringify(values),
				headers: { "Content-Type": "application/json" },
				...options,
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

	return {
		form,
		handleSubmit: (values: TValues) => mutate(values),
		isPending,
	};
}
