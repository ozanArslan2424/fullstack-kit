import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { app } from "@/lib/config";
import { sendRequest } from "@/utils/send-request";

export type ProfileData = z.infer<typeof app.server.profile.schema>;

export function useProfile() {
	return useQuery<ProfileData>({
		queryKey: [app.server.profile.path],
		queryFn: () =>
			sendRequest(app.server.profile.path, {
				method: app.server.profile.method,
			}),
		retry: 1,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
	});
}
