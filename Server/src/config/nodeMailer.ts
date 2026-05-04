// config/nodeMailer.ts
import { env } from '../utils/zodEnvFilesValidator.js';

export const sendBrevoEmail = async (
    to: string,
    subject: string,
    html: string
) => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'api-key': env.BREVO_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sender: { email: env.SENDER_EMAIL, name: "Campus Events" },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Brevo API error: ${JSON.stringify(error)}`);
    }
};