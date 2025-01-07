import { env } from "bun";
import { eq } from "drizzle-orm";
import { ONE_DAY } from "@/lib/constants";
import { db, table } from "@/server/db";
import { SessionSelect } from "@/server/db/types";
import { htmlToString } from "@/server/email/html-to-string";
import { sendEmail } from "@/server/email/send-email";

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
