// lib/mail.ts
import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT ?? 587);
const secure =
  process.env.SMTP_SECURE === "true" || port === 465; // auto-true for 465

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Default "from" address for all emails
const DEFAULT_FROM =
  process.env.SMTP_FROM || '"Resumint" <no-reply@yourdomain.com>';

/**
 * Generic mail helper for any route
 */
export async function sendMail(opts: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}) {
  const { to, subject, text, html, from } = opts;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(
      "[mail] SMTP_* env vars are not fully set. Email will not be sent."
    );
    return;
  }

  await transporter.sendMail({
    from: from || DEFAULT_FROM,
    to,
    subject,
    // nodemailer is fine with both; if html is provided, most clients use it
    text: text || "",
    html: html || text || "",
  });
}

/**
 * Specific helper for password reset OTP
 */
export async function sendPasswordResetEmail(to: string, otp: string) {
  const subject = "Your Resumint password reset code";
  const text = `Your password reset code is ${otp}. It expires in 15 minutes.`;
  const html = `<p>Your password reset code is <b>${otp}</b>. It expires in 15 minutes.</p>`;

  await sendMail({ to, subject, text, html });
}
