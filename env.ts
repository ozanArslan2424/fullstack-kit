import { z } from "zod";

export const env = z
	.object({
		NODE_ENV: z.string().default("development"),
		APP_NAME: z.string(),
		BASE_URL: z.string(),
		EMAIL_HOST: z.string(),
		EMAIL_PORT: z.string(),
		EMAIL_USER: z.string(),
		EMAIL_PASS: z.string(),
		EMAIL_FROM: z.string(),
	})
	.parse(process.env);
