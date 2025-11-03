// app/api/settings/password/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { verifyAccessToken } from "@/lib/jwt";
// ⬇️ IMPORTANT: change to your real password helper import
import { verifyPassword, hashPassword } from "@/lib/password"; // <-- adjust path

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function requireUid(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await verifyAccessToken(token);
    return payload?.sub ? String(payload.sub) : null;
  } catch {
    return null;
  }
}

const ChangePasswordBody = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8).max(128),
});

// POST /api/settings/password
export async function POST(req: NextRequest) {
  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  const bodyUnknown = await req.json().catch(() => null);
  if (!bodyUnknown) return json({ error: "Invalid JSON body" }, 400);

  const parsed = ChangePasswordBody.safeParse(bodyUnknown);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

  const { currentPassword, newPassword } = parsed.data;

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, uid),
  });
  if (!user) return json({ error: "User not found" }, 404);

  if (user.provider !== "password") {
    return json({ error: "Password login not enabled for this account" }, 400);
  }
  if (!user.passwordHash) {
    return json({ error: "No password is set for this account" }, 400);
  }

  const ok = await verifyPassword(currentPassword, user.passwordHash);
  if (!ok) return json({ error: "Current password is incorrect" }, 400);

  const newHash = await hashPassword(newPassword);
  await db
    .update(usersTable)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(usersTable.id, uid));

  return json({ ok: true });
}
