import { log } from "./log";

export function getErrorMessage(error: unknown) {
	let message: string;

	if (error instanceof Error) {
		message = error.message;
	} else if (error && typeof error === "object" && "message" in error) {
		message = String(error.message);
	} else if (typeof error === "string") {
		message = error;
	} else {
		message = "Something went wrong";
	}

	log.error("Caught Error:", message);
	return message;
}

export function findNullMessage(items: { obj: unknown; message: string }[]): string | undefined {
	for (const item of items) {
		if (isFalsy(item.obj)) {
			return item.message;
		}
	}
	return undefined;
}

export function isFalsy(value: any): boolean {
	return (
		value === null ||
		value === undefined ||
		value === "" ||
		value === false ||
		value === 0 ||
		value.length === 0
	);
}
