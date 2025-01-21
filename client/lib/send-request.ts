export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

export type RequestOptions = Omit<RequestInit, "method" | "body"> & {
	params?: ServerRoutePathParam<ServerRoutePath>;
	search?: ServerRouteSearchParam<ServerRoutePath>;
};

async function handleRes<TReturn extends Record<string, string> = { message: string }>(
	fetch: Promise<Response>,
) {
	const res = await fetch;
	const data = (await res.json()) as TReturn;

	const contentType = res.headers.get("Content-Type");

	if (!contentType || !contentType.includes("application/json")) {
		throw new TypeError("Oops, we haven't got JSON!");
	}

	if (!res.ok) {
		const error = (data && data.message) || res.statusText;
		return Promise.reject(error);
	}

	return data;
}

export async function sendRequest<TValues = void>(
	path: ServerRoutePath,
	method: RequestMethod,
	values: TValues,
	options: RequestOptions = {
		headers: { "Content-Type": "application/json" },
	},
) {
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

	return fetch(url, {
		...rest,
		method,
		body: JSON.stringify(values),
	});
}
