import { z } from "zod";

const envSchema = z.object({
	APP_NAME: z.string(),
	BASE_URL: z.string(),
	EMAIL_HOST: z.string(),
	EMAIL_PORT: z.string(),
	EMAIL_USER: z.string(),
	EMAIL_PASS: z.string(),
	EMAIL_FROM: z.string(),
	PAGES_DIR_PATH: z.string(),
	CONFIG_FILE_PATH: z.string(),
});

const processEnv = process.env;

export const env = envSchema.parse(processEnv);
