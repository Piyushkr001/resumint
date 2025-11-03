// app/api/settings/delete-account/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { verifyAccessToken } from "@/lib/jwt";

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

const DeleteBody = z.object({
  confirm: z.literal(true),
});

// POST /api/settings/delete-account
export async function POST(req: NextRequest) {
  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  const bodyUnknown = await req.json().catch(() => null);
  if (!bodyUnknown) return json({ error: "Invalid JSON body" }, 400);

  const parsed = DeleteBody.safeParse(bodyUnknown);
  if (!parsed.success) {
    return json({ error: "Confirmation required" }, 400);
  }

  // Ensure user exists
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, uid),
  });
  if (!user) return json({ error: "User not found" }, 404);

  await db.delete(usersTable).where(eq(usersTable.id, uid));

  // Clear cookies
  const res = json({ ok: true });
  res.cookies.set("session", "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set("refresh", "", { httpOnly: true, path: "/", maxAge: 0 });

  return res;
}
