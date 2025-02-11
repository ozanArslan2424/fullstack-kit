import { zodResolver } from "@hookform/resolvers/zod";
import {
	FieldValues,
	UseFormProps,
	UseFormReturn,
	useForm as useReactHookForm,
} from "react-hook-form";
import { ZodType } from "zod";

type UseFormOptions<TValues extends FieldValues> = {
	schema: ZodType<TValues>;
} & UseFormProps<TValues>;

export function useForm<TValues extends FieldValues = FieldValues>({
	schema,
	...rest
}: UseFormOptions<TValues>): UseFormReturn<TValues> {
	return useReactHookForm<TValues>({
		resolver: zodResolver(schema),
		...rest,
	});
}
