import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm as useReactHookForm } from "react-hook-form";
import { ZodType } from "zod";

export function useForm<TValues extends FieldValues>({ schema }: { schema: ZodType<TValues> }) {
	const form = useReactHookForm<TValues>({
		resolver: zodResolver(schema),
	});

	return form;
}
