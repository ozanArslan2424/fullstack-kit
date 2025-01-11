import { pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";
import { env } from "@/lib/env";

export function logger() {
	const prettied = env.NODE_ENV === "production" ? undefined : pretty();
	const level = env.LOG_LEVEL || "info";

	return pinoLogger({
		pino: pino({ level }, prettied),
		http: {},
	});
}
