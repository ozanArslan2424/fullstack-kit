import { useMutation } from "@tanstack/react-query";
import { RequestMethod, RequestOptions, sendRequest } from "@/lib/send-request";

type UseRequestOptions<TValues, TData> = {
	path: ServerRoutePath;
	method: RequestMethod;
	options?: RequestOptions;
	onSuccess?: (data: TData) => void;
	onError?: (error: Error) => void;
	onElse?: (values: TValues) => void;
};

export function useRequest<TValues = void, TData = any>({
	path,
	method,
	options,
	onError,
	onSuccess,
	onElse,
}: UseRequestOptions<TValues, TData>) {
	const { mutate, isPending } = useMutation<TData, Error, TValues>({
		mutationFn: async (values) => {
			const res = await sendRequest(path, method, values, options);
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

	return { mutate, isPending };
}
