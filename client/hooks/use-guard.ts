import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";
import { useRouter } from "@/client/hooks/use-router";
import { sendRequest } from "@/client/utils/send-request";
import { profileGetSchema } from "@/db/zod";

type Role = "logged-in" | "logged-out" | "admin" | "no-guard";

export type ProfileData = z.infer<typeof profileGetSchema>;

export function useGuard(
	only: Role = "no-guard",
	redirectTo?: ClientRoutePath,
): ProfileData | undefined {
	const router = useRouter();
	const { data, isSuccess, isPending } = useQuery<ProfileData>({
		queryKey: ["profile"],
		queryFn: async () => {
			const { data, res } = await sendRequest("/api/auth/profile", {
				method: "GET",
			});

			if (!res.ok) {
				throw new Error(data.message);
			}

			return data;
		},
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
