import { useId } from "react";

export function useFieldId(name: string) {
	return useId() + name;
}
