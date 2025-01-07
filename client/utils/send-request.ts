export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

export type RequestOptions = Omit<RequestInit, "method"> & {
	method?: RequestMethod;
	params?: ServerRoutePathParam<ServerRoutePath>;
	search?: ServerRouteSearchParam<ServerRoutePath>;
};

export async function sendRequest<T = any>(path: ServerRoutePath, options: RequestOptions = {}) {
	const { params, search, ...rest } = options;
	let url: string = path;

	if (params) {
		for (const key of Object.keys(params) as Array<
			keyof ServerRoutePathParam<ServerRoutePath>
		>) {
			url = url.replace(`:${key}`, params[key]);
		}
	}
	if (search) {
		const searchParams = new URLSearchParams();
		Object.entries(search as Record<string, string>).forEach(([key, value]) => {
			searchParams.append(key, value);
		});
		const searchString = searchParams.toString();
		if (searchString) {
			url = `${url}${url.includes("?") ? "&" : "?"}${searchString}`;
		}
	}

	const res = await fetch(url, rest);
	const data = (await res.json()) as T;

	return { res, data };
}

export type RequestReturn<T = any> = ReturnType<typeof sendRequest<T>>;
