import { AlertDialog } from "./alert";
import { DefaultDialog } from "./default";
import { SheetDialog } from "./sheet";
import type { AlertDialogProps, CombinedDialogProps, DefaultDialogProps, SheetDialogProps } from "./types";

export function Dialog({ variant = "dialog", ...rest }: CombinedDialogProps) {
	if (variant === "sheet") {
		return <SheetDialog {...(rest as SheetDialogProps)} />;
	}

	if (variant === "alert") {
		return <AlertDialog {...(rest as AlertDialogProps)} />;
	}

	return <DefaultDialog {...(rest as DefaultDialogProps)} />;
}
