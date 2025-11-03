// app/api/auth/reset-password/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "@/config/db";
import {
  usersTable,
  passwordResetTokensTable,
  refreshTokensTable,
} from "@/config/schema";
import { hashPassword } from "@/lib/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

const ResetBody = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(10),
  newPassword: z.string().min(8).max(128),
});

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: NextRequest) {
  const bodyUnknown = await req.json().catch(() => null);
  const parsed = ResetBody.safeParse(bodyUnknown);

  if (!parsed.success) {
    return json({ error: "Invalid input" }, 400);
  }

  const { email, otp, newPassword } = parsed.data;
  const emailNorm = normalizeEmail(email);

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, emailNorm),
  });

  if (!user) {
    // Generic error (don't reveal whether the email exists)
    return json({ error: "Invalid code or email" }, 400);
  }

  const now = new Date();
  const otpHash = hashOtp(otp);

  // Find a matching, unused, unexpired token
  const token = await db.query.passwordResetTokensTable.findFirst({
    where: and(
      eq(passwordResetTokensTable.userId, user.id),
      eq(passwordResetTokensTable.otpHash, otpHash),
      isNull(passwordResetTokensTable.usedAt),
      gt(passwordResetTokensTable.expiresAt, now),
    ),
    orderBy: (t, { desc }) => desc(t.createdAt),
  });

  if (!token) {
    return json({ error: "Invalid or expired code" }, 400);
  }

  const newHash = await hashPassword(newPassword);

  await db.transaction(async (tx) => {
    // 1) Update the user's password
    await tx
      .update(usersTable)
      .set({ passwordHash: newHash, updatedAt: now })
      .where(eq(usersTable.id, user.id));

    // 2) Mark this reset token as used
    await tx
      .update(passwordResetTokensTable)
      .set({ usedAt: now })
      .where(eq(passwordResetTokensTable.id, token.id));

    // 3) Optional but recommended: revoke all active refresh tokens
    await tx
      .update(refreshTokensTable)
      .set({ revoked: true })
      .where(eq(refreshTokensTable.userId, user.id));
  });

  return json({ ok: true });
}
