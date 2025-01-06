import { eq } from "drizzle-orm";
import { env } from "@/env";
import { db, table } from "@/server/db";
import type { SessionSelect } from "@/server/db/types";
import { htmlToString } from "@/server/email/html-to-string";
import { sendEmail } from "@/server/email/send-email";
import { ONE_DAY } from "@/server/lib/constants";

export const log = {
	clear: () => console.clear(),
	default: (...data: any[]) => console.log(...data),
	start: (...data: any[]) => console.log("▶️", ...data),
	end: (...data: any[]) => console.log("⏸️", ...data),
	debug: (...data: any[]) => console.debug("🐛", ...data),
	info: (...data: any[]) => console.info("🔵", ...data),
	warn: (...data: any[]) => console.warn("🟡", ...data),
	error: (...data: any[]) => console.error("🔴", ...data),
	success: (...data: any[]) => console.log("🟢", ...data),
	box: (...data: any[]) => {
		console.log("🎁 ------------------------------------------------------");
		console.log(...data);
		console.log("------------------------------------------------------ 🎁");
	},
};

export function getErrorMessage(error: unknown) {
	let message: string;

	if (error instanceof Error) {
		message = error.message;
	} else if (error && typeof error === "object" && "message" in error) {
		message = String(error.message);
	} else if (typeof error === "string") {
		message = error;
	} else {
		message = "Something went wrong";
	}

	log.error("Caught Error:", message);
	return message;
}

export function generateSessionToken() {
	return Bun.randomUUIDv7("base64url");
}

export async function createSession(token: string, userId: string) {
	const hasher = new Bun.CryptoHasher("sha256");
	const sessionId = hasher.update(token).digest("hex");

	const session: SessionSelect = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + ONE_DAY * 30),
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const hasher = new Bun.CryptoHasher("sha256");
	const sessionId = hasher.update(token).digest("hex");

	const [result] = await db
		.select()
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - ONE_DAY * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + ONE_DAY * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export async function verifyPassword(passwordHash: string, password: string) {
	return Bun.password.verify(password, passwordHash);
}

export async function hashPassword(password: string) {
	return Bun.password.hash(password);
}

export async function sendVerificationEmail(email: string, verificationToken: string) {
	const emailHtmlString = await htmlToString("verify-email");
	const verifyEmailLink = `${env.BASE_URL}/verify-email?email=${email}&token=${verificationToken}`;
	const subject = "Tabula Email Verification";
	const html = emailHtmlString.replace("{{url}}", verifyEmailLink);
	const text = `Please click the link to verify your email. ${verifyEmailLink}`;

	return sendEmail({ to: email, subject, html, text });
}
