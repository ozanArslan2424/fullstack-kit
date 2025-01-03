import { app, serverRoutePaths } from "@/lib/config";

type ExtractRouteParams<T> = T extends `${infer _Start}:${infer Param}/${infer Rest}`
	? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
	: T extends `${infer _Start}:${infer Param}`
		? { [k in Param]: string }
		: { [k in string]: string };

type ExtractSearchParams<P> = P extends `${infer _Start}?${infer Search}`
	? { [k in Search]: string }
	: { [k in string]: string };

export type AppConfig = typeof app;

export type ServerRoutePath = (typeof serverRoutePaths)[number];
export type ServerRoutePathParam<P extends ServerRoutePath> = ExtractRouteParams<P>;
export type ServerRouteSearchParam<P extends ServerRoutePath> = ExtractSearchParams<P>;

export type RequestMethod =
	| "GET"
	| "HEAD"
	| "OPTIONS"
	| "TRACE"
	| "PUT"
	| "DELETE"
	| "POST"
	| "PATCH"
	| "CONNECT";

export type RequestOptions = Omit<RequestInit, "method"> & {
	method?: RequestMethod;
	params?: ServerRoutePathParam<ServerRoutePath>;
	search?: ServerRouteSearchParam<ServerRoutePath>;
};
