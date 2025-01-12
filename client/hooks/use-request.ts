import { useMutation } from "@tanstack/react-query";
import { RequestOptions, RequestReturn, sendRequest } from "../utils/send-request";

type Res<T> = Awaited<RequestReturn<T>>["res"];
type Data<T> = Awaited<RequestReturn<T>>["data"];

type UseRequestOptions<TValues, TData> = {
	path: ServerRoutePath;
	options?: RequestOptions;
	onSuccess?: (data: Data<TData>, res: Res<TData>) => void;
	onError?: "throw" | ((error: Error) => void);
	optimisticUpdate?: (values: TValues) => void;
};

export function useRequest<TValues, TData = any>({
	path,
	options,
	onSuccess,
	onError,
	optimisticUpdate,
}: UseRequestOptions<TValues, TData>) {
	const { mutate, isPending } = useMutation<Awaited<RequestReturn<TData>>, Error, TValues>({
		mutationFn: (values) => sendRequest(path, { ...options, body: JSON.stringify(values) }),
		onSuccess: ({ data, res }) => onSuccess?.(data, res),
		onError: onError === "throw" ? undefined : onError,
		throwOnError: onError === "throw",
		onMutate: optimisticUpdate,
	});

	return { mutate, isPending };
}
