export function pathToPascalCase(str: string): string {
	return str.replaceAll("/", "-").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function removeSlash(str: string): string {
	const first = str.startsWith("/") ? str.slice(1) : str;
	const last = first.endsWith("/") ? first.slice(0, -1) : first;
	return last;
}

export function makePath(...args: string[]): string {
	args = args.map((arg) => removeSlash(arg));
	return args.join("/");
}
