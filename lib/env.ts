import { ZodError, z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.string().default("development"),
	APP_NAME: z.string(),
	PORT: z.coerce.number().default(3000),
	LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
	BASE_URL: z.string(),
	EMAIL_HOST: z.string(),
	EMAIL_PORT: z.string(),
	EMAIL_USER: z.string(),
	EMAIL_PASS: z.string(),
	EMAIL_FROM: z.string(),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
	env = envSchema.parse(process.env);
} catch (e) {
	const error = e as ZodError;
	console.error("🔴 Invalid env variables", JSON.stringify(error.flatten().fieldErrors, null, 2));
	process.exit(1);
}

export { env };
