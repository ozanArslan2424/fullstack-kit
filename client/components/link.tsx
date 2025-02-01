import { Link as DOMLink, NavLink as DOMNavLink } from "react-router";
import type { LinkProps as DOMLinkProps, NavLinkProps as DOMNavLinkProps } from "react-router";

export type TypedRegularLinkProps = {
	variant?: "regular";
	to: ClientRoutePath;
	params?: ClientRoutePathParam<ClientRoutePath>;
	search?: ClientRouteSearchParam<ClientRoutePath>;
	hash?: string;
} & Omit<DOMLinkProps, "to">;

export type TypedNavLinkProps = {
	variant?: "nav";
	to: ClientRoutePath;
	params?: ClientRoutePathParam<ClientRoutePath>;
	search?: ClientRouteSearchParam<ClientRoutePath>;
	hash?: string;
} & Omit<DOMNavLinkProps, "to">;

export type TypedLinkProps = TypedRegularLinkProps | TypedNavLinkProps;

export function Link({ variant = "regular", to, params, search, hash, ...rest }: TypedLinkProps) {
	let href: string = to;

	if (params) {
		for (const key of Object.keys(params) as Array<
			keyof ClientRoutePathParam<ClientRoutePath>
		>) {
			href = href.replace(`:${key}`, params[key]);
		}
	}

	if (search) {
		const searchParams = new URLSearchParams();
		Object.entries(search as Record<string, string>).forEach(([key, value]) => {
			searchParams.append(key, value);
		});
		const searchString = searchParams.toString();
		if (searchString) {
			href = `${href}${href.includes("?") ? "&" : "?"}${searchString}`;
		}
	}

	if (hash) {
		href = `${href}${href.includes("#") ? "" : "#"}${hash}`;
	}

	return variant === "nav" ? (
		<DOMNavLink {...(rest as DOMNavLinkProps)} to={href} />
	) : (
		<DOMLink {...(rest as DOMLinkProps)} to={href} />
	);
}
