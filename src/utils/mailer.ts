import nodemailer from 'nodemailer';
import fs from 'fs';
import ejs from 'ejs';
import { htmlToText } from 'html-to-text';
import juice from 'juice';

const transporter = nodemailer.createTransport({
	host: 'smtp.mailgun.org',
	port: 587,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

interface props<T> extends nodemailer.SendMailOptions {
	templateName?: string;
	templateVars?: T;
	from?: string;
	to: string;
	subject: string;
	html?: string;
	text?: string;
}

const sendMail = <T>({
	templateName,
	templateVars,
	from = 'People <noreply@people.kartikbhalla.dev>',
	attachments,
	...rest
}: props<T>) => {
	const templatePath = `src/views/${templateName}.html`;

	if (templateName && fs.existsSync(templatePath)) {
		const template = fs.readFileSync(templatePath, 'utf-8');
		const html = ejs.render(template, templateVars);
		const text = htmlToText(html, {
			selectors: [
				{ selector: 'h1', options: { uppercase: false } },
				{ selector: 'h3', options: { uppercase: false } },
			],
		});
		const htmlWithStylesInlined = juice(html);

		return transporter.sendMail({
			...rest,
			from,
			html: htmlWithStylesInlined,
			text,
			attachments: [
				{
					filename: 'people-logo.png',
					path: 'src/views/people-logo.png',
					cid: 'logo',
				},
			],
		});
	}

	return transporter.sendMail({ ...rest, from });
};

export default sendMail;
