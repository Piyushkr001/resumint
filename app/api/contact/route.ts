// app/api/contact/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/config/db";
import { contactMessagesTable } from "@/config/schema";
import { sendMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ContactBody = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject too short"),
  message: z.string().min(10, "Message too short"),
});

function json(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const bodyUnknown = await req.json().catch(() => null);
    const parsed = ContactBody.safeParse(bodyUnknown);
    if (!parsed.success) {
      return json({ error: parsed.error.flatten() }, 400);
    }

    const { name, email, subject, message } = parsed.data;
    const emailNorm = email.trim().toLowerCase();

    // 1) Store in DB (so you never lose a message)
    const [inserted] = await db
      .insert(contactMessagesTable)
      .values({
        name,
        email: emailNorm,
        subject,
        message,
        // status / createdAt use defaults
      })
      .returning();

    let emailSent = false;

    // 2) Try to send email notification (best-effort)
    const inbox = process.env.CONTACT_INBOX_EMAIL;

    if (!inbox) {
      console.warn(
        "[contact] CONTACT_INBOX_EMAIL not set. Message stored, but no email was sent."
      );
    } else {
      try {
        await sendMail({
          to: inbox,
          subject: `[Resumint Contact] ${subject} — ${name}`,
          text: `From: ${name} <${emailNorm}>\n\n${message}`,
          html: `
            <p><b>New contact message</b></p>
            <p><b>From:</b> ${name} &lt;${emailNorm}&gt;</p>
            <p><b>Subject:</b> ${subject}</p>
            <hr />
            <p>${message.replace(/\n/g, "<br />")}</p>
          `,
        });
        emailSent = true;
      } catch (err) {
        console.error("[contact] Error sending contact email:", err);
        // We still return 200, because the message *is* saved.
      }
    }

    return json({
      ok: true,
      emailSent,
      id: inserted.id,
    });
  } catch (e: any) {
    console.error("contact route error:", e);
    return json({ error: e?.message ?? "Internal error" }, 500);
  }
}
