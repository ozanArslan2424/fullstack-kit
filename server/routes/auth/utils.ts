import { hash, verify } from "@node-rs/argon2";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { db, table } from "@/server/db";
import type { SessionSelect } from "@/server/db/types";
import { htmlToString } from "@/server/email/html-to-string";
import { sendEmail } from "@/server/email/send-email";
import { env } from "@/server/env";
import { ONE_DAY } from "@/server/routes/auth/constants";

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: SessionSelect = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + ONE_DAY * 30),
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
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
	return verify(passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
}

export async function hashPassword(password: string) {
	return hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
}

export async function sendVerificationEmail(email: string, verificationToken: string) {
	const emailHtmlString = await htmlToString("verify-email");
	const verifyEmailLink = `${env.BASE_URL}/verify-email?email=${email}&token=${verificationToken}`;
	const subject = "Tabula Email Verification";
	const html = emailHtmlString.replace("{{url}}", verifyEmailLink);
	const text = `Please click the link to verify your email. ${verifyEmailLink}`;

	return sendEmail({ to: email, subject, html, text });
}
