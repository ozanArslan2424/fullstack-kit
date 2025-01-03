import type { RequestOptions, ServerRoutePath, ServerRoutePathParam } from "../lib/types";

export async function sendRequest<T = any>(path: ServerRoutePath, options: RequestOptions = {}) {
	const { params, search } = options;
	let url: string = path;

	// Handle path parameters
	if (params) {
		for (const key of Object.keys(params) as Array<
			keyof ServerRoutePathParam<ServerRoutePath>
		>) {
			url = url.replace(`:${key}`, params[key]);
		}
	}

	// Handle search parameters
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

	const res = await fetch(url, options);
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message);
	}

	return data as T;
}
