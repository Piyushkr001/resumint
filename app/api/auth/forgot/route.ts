// app/api/auth/forgot/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { eq } from "drizzle-orm";

import { db } from "@/config/db";
import { usersTable, passwordResetTokensTable } from "@/config/schema";
import { sendPasswordResetEmail } from "@/lib/mail"; // ⬅️ NEW

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

const ForgotBody = z.object({
  email: z.string().email(),
});

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// Simple 6-digit numeric OTP
function generateOtp(): string {
  const n = Math.floor(100000 + Math.random() * 900000); // 100000–999999
  return String(n);
}

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: NextRequest) {
  const bodyUnknown = await req.json().catch(() => null);
  const parsed = ForgotBody.safeParse(bodyUnknown);

  if (!parsed.success) {
    return json({ error: "Invalid email" }, 400);
  }

  const emailNorm = normalizeEmail(parsed.data.email);

  // Try to find the user; if not found, we still return ok (no enumeration)
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, emailNorm),
  });

  if (!user) {
    // Still return ok, but do nothing. Frontend shows generic success.
    return json({ ok: true });
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

  // Optionally: clear old tokens for this user/email (not required, but cleaner)
  await db
    .delete(passwordResetTokensTable)
    .where(eq(passwordResetTokensTable.userId, user.id));

  // Store OTP
  await db.insert(passwordResetTokensTable).values({
    userId: user.id,
    email: emailNorm,
    otpHash,
    expiresAt,
  });

  // Send email with OTP
  try {
    await sendPasswordResetEmail(emailNorm, otp);
  } catch (err) {
    console.error("Error sending password reset email:", err);
    // Generic error so we don't leak details
    return json({ error: "Could not send reset email. Please try again." }, 500);
  }

  // Keep this for local debugging if you want
  console.log(`Password reset OTP for ${emailNorm}: ${otp}`);

  return json({ ok: true });
}
