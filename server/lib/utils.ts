import { z } from "@hono/zod-openapi";
import { jsonContent, jsonContentOneOf } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { ZodType } from "zod";

export const messageSchema = z.object({ message: z.string() });

export const json = {
	internalServerError: () => jsonContent(messageSchema, "Internal server error."),
	notFound: () => jsonContent(messageSchema, "Not found."),
	badRequest: () => jsonContent(messageSchema, "Bad request."),
	unauthorized: () => jsonContent(messageSchema, "Unauthorized."),
	response: <T = any>(description: string, schema: ZodType<T>) =>
		jsonContent(schema, description),
	requestBody: <T = any>(description: string, schema: ZodType<T>) =>
		jsonContent(schema, description),
	unprocessableEntity: (schema: ZodType) =>
		jsonContent(createErrorSchema(schema), "Unprocessable entity."),
	unprocessableEntityOneOf: (schemas: ZodType[]) =>
		jsonContentOneOf(
			schemas.map((s) => createErrorSchema(s)),
			"Unprocessable entity.",
		),
};
