import { Resend } from "resend";

export interface EmailService {
    sendEmail(to: string, subject: string, html: string): Promise<boolean>;
}

class ResendService implements EmailService {
    private resend: Resend;

    constructor() {
        if (!process.env.RESEND_API_KEY) {
            console.warn("RESEND_API_KEY is missing. Email service will run in MOCK mode.");
        }
        this.resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");
    }

    async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
            console.log(`[MOCK EMAIL] Body: ${html}`);
            return true;
        }

        try {
            const { data, error } = await this.resend.emails.send({
                from: "JanTrack Admin <onboarding@resend.dev>", // Default Resend testing domain
                to: [to], // Resend free tier only allows sending to the verified email
                subject: subject,
                html: html,
            });

            if (error) {
                console.error("Resend API Error:", error);
                return false;
            }

            console.log("Email sent successfully via Resend:", data?.id);
            return true;
        } catch (error) {
            console.error("Failed to send email via Resend:", error);
            return false;
        }
    }
}

export const emailService = new ResendService();
