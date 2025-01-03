export function timestamp(input: string | Date, locale: string = "en-US"): string {
	const date = typeof input === "string" ? new Date(input) : input;

	if (isNaN(date.getTime())) {
		throw new Error("Invalid date input");
	}

	return date.toLocaleDateString(locale, {
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
}
