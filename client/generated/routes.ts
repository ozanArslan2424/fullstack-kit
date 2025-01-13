
	// Auto-generated file. Do not edit.
	type ExtractRouteParams<T> = T extends `${infer _Start}:${infer Param}/${infer Rest}`
		? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
		: T extends `${infer _Start}:${infer Param}`
			? { [k in Param]: string }
			: { [k in string]: string };
	type ExtractSearchParams<P> = P extends `${infer _Start}?${infer Search}`
		? { [k in Search]: string }
		: { [k in string]: string };

	declare global {
		
	type ClientRoutePath = "/verify-email" | "/register" | "/profile" | "/forgot-password" | "/" | "/change-password" | "/login";
	type ClientRoutePathParam<P extends ClientRoutePath> = ExtractRouteParams<P>;
	type ClientRouteSearchParam<P extends ClientRoutePath> = ExtractSearchParams<P>;
		
	type ServerRoutePath = "/api/auth/verify-email-resend" | "/api/auth/logout" | "/api/auth/login" | "/api/auth/forgot-password" | "/api/auth/register" | "/api/auth/change-password" | "/api/auth/profile" | "/api/auth/verify-email";
	type ServerRoutePathParam<P extends ServerRoutePath> = ExtractRouteParams<P>;
	type ServerRouteSearchParam<P extends ServerRoutePath> = ExtractSearchParams<P>;
	}

	export const clientRoutePaths:ClientRoutePath[] = [
  "/verify-email",
  "/register",
  "/profile",
  "/forgot-password",
  "/",
  "/change-password",
  "/login"
];
	export const serverRoutePaths:ServerRoutePath[] = [
  "/api/auth/verify-email-resend",
  "/api/auth/logout",
  "/api/auth/login",
  "/api/auth/forgot-password",
  "/api/auth/register",
  "/api/auth/change-password",
  "/api/auth/profile",
  "/api/auth/verify-email"
];
	export const routesConfig = [
  {
    "path": "/api/auth/verify-email-resend",
    "method": "POST"
  },
  {
    "path": "/api/auth/logout",
    "method": "POST"
  },
  {
    "path": "/api/auth/login",
    "method": "POST"
  },
  {
    "path": "/api/auth/forgot-password",
    "method": "POST"
  },
  {
    "path": "/api/auth/register",
    "method": "POST"
  },
  {
    "path": "/api/auth/change-password",
    "method": "POST"
  },
  {
    "path": "/api/auth/profile",
    "method": "GET"
  },
  {
    "path": "/api/auth/verify-email",
    "method": "POST"
  },
  {
    "path": "/verify-email",
    "method": "PAGE"
  },
  {
    "path": "/register",
    "method": "PAGE"
  },
  {
    "path": "/profile",
    "method": "PAGE"
  },
  {
    "path": "/forgot-password",
    "method": "PAGE"
  },
  {
    "path": "/",
    "method": "PAGE"
  },
  {
    "path": "/change-password",
    "method": "PAGE"
  },
  {
    "path": "/login",
    "method": "PAGE"
  }
];

