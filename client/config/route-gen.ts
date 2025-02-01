
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
	
type ClientRoutePath = "/" | "/profile" | "/auth/login" | "/auth/register" | "/auth/forgot-password" | "/auth/change-password" | "/auth/verify-email";
type ClientRoutePathParam<P extends ClientRoutePath> = ExtractRouteParams<P>;
type ClientRouteSearchParam<P extends ClientRoutePath> = ExtractSearchParams<P>;

	
type ServerRoutePath = "/admin/doc" | "/admin/ref" | "/api/auth/login" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/register" | "/api/auth/register" | "/api/auth/verify-email" | "/api/auth/verify-email" | "/api/auth/verify-email-resend" | "/api/auth/verify-email-resend" | "/api/auth/change-password" | "/api/auth/change-password" | "/api/auth/forgot-password" | "/api/auth/forgot-password" | "/api/auth/profile";
type ServerRoutePathParam<P extends ServerRoutePath> = ExtractRouteParams<P>;
type ServerRouteSearchParam<P extends ServerRoutePath> = ExtractSearchParams<P>;

}

export const clientRoutePaths:ClientRoutePath[] = [
  "/",
  "/profile",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/change-password",
  "/auth/verify-email"
];
export const serverRoutePaths:ServerRoutePath[] = [
  "/admin/doc",
  "/admin/ref",
  "/api/auth/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
  "/api/auth/register",
  "/api/auth/verify-email",
  "/api/auth/verify-email",
  "/api/auth/verify-email-resend",
  "/api/auth/verify-email-resend",
  "/api/auth/change-password",
  "/api/auth/change-password",
  "/api/auth/forgot-password",
  "/api/auth/forgot-password",
  "/api/auth/profile"
];
