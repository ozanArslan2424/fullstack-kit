import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import type { NavigateOptions } from "react-router";

export function useRouter() {
	const navigate = useNavigate();
	const location = useLocation();

	const router = useMemo(
		() => ({
			back: () => navigate(-1),
			forward: () => navigate(1),
			push: (to: ClientRoutePath, options?: NavigateOptions) => navigate(to, options),
			replace: (to: ClientRoutePath, options?: NavigateOptions) =>
				navigate(to, { replace: true, ...options }),
			location: location,
		}),
		[navigate, location],
	);

	return router;
}
