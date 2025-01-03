import { createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { env } from "@/server/env";
import { getErrorMessage } from "@/server/utils";
import { log } from "@/server/utils";

const options: SMTPTransport.Options = {
	host: env.EMAIL_HOST,
	port: parseInt(env.EMAIL_PORT),
	auth: {
		user: env.EMAIL_USER,
		pass: env.EMAIL_PASS,
	},
};

const transporter = createTransport(options);

export async function sendEmail(options: {
	to: string;
	subject: string;
	html: string;
	text: string;
}) {
	try {
		const info = await transporter.sendMail({
			from: env.EMAIL_FROM,
			...options,
		});

		const emailLog = {
			from: "📤 From: " + info.envelope.from,
			to: "📩 To: " + info.envelope.to,
			messageId: "📧 Message Id: " + info.messageId,
		};

		log.box(emailLog);

		return { error: false, message: "💌 Email sent successfully!" };
	} catch (error) {
		const message = getErrorMessage(error);
		return { error: true, message };
	}
}
