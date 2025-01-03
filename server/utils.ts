export const log = {
	clear: () => console.clear(),
	default: (...data: any[]) => console.log(...data),
	start: (...data: any[]) => console.log("▶️", ...data),
	end: (...data: any[]) => console.log("⏸️", ...data),
	debug: (...data: any[]) => console.debug("🐛", ...data),
	info: (...data: any[]) => console.info("🔵", ...data),
	warn: (...data: any[]) => console.warn("🟡", ...data),
	error: (...data: any[]) => console.error("🔴", ...data),
	success: (...data: any[]) => console.log("🟢", ...data),
	box: (...data: any[]) => {
		console.log("🎁 ------------------------------------------------------");
		console.log(...data);
		console.log("------------------------------------------------------ 🎁");
	},
};

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
