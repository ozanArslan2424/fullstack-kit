import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";
import { useRouter } from "@/client/hooks/use-router";
import { app } from "@/client/lib/config";
import { sendRequest } from "@/client/utils/send-request";

type Role = "logged-in" | "logged-out" | "admin" | "no-guard";

export type ProfileData = z.infer<typeof app.server.profile.schema>;

export function useGuard(
	only: Role = "no-guard",
	redirectTo?: ClientRoutePath,
): ProfileData | undefined {
	const router = useRouter();
	const { data, isSuccess, isPending } = useQuery<ProfileData>({
		queryKey: [app.server.profile.path],
		queryFn: () =>
			sendRequest(app.server.profile.path, {
				method: app.server.profile.method,
			}),
		retry: false,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
	});

	// TODO: Add admin role check
	const userRole = isSuccess ? "logged-in" : "logged-out";
	const userHasAccess = !isPending && userRole !== only && only !== "no-guard";

	useEffect(() => {
		if (userHasAccess && redirectTo) {
			router.push(redirectTo);
		}
	}, [userHasAccess, redirectTo, router]);

	return data;
}
