import { Context } from "hono";
import { SessionSelect, UserSelect } from "@/server/db/types";

export interface HonoType {
	Variables: {
		user: UserSelect | null;
		session: SessionSelect | null;
	};
}

export interface HonoContext extends Context<HonoType> {}
