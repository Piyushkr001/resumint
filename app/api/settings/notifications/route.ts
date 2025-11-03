import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/config/db";
import { userNotificationsTable } from "@/config/schema"; // 👈 updated
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

const NotifBody = z.object({
  productUpdates: z.boolean(),
  weeklyDigest: z.boolean(),
  atsAlerts: z.boolean(),
  marketing: z.boolean(),
});

// GET /api/settings/notifications
export async function GET(_req: NextRequest) {
  try {
    const uid = await requireUid();
    if (!uid) return json({ error: "Unauthorized" }, 401);

    const row = await db.query.userNotificationsTable.findFirst({
      where: eq(userNotificationsTable.userId, uid),
    });

    return json({
      productUpdates: row?.productUpdates ?? true,
      weeklyDigest: row?.weeklyDigest ?? true,
      atsAlerts: row?.atsAlerts ?? true,
      marketing: row?.marketing ?? false,
    });
  } catch (e: any) {
    console.error("settings/notifications GET error:", e);
    return json({ error: e?.message ?? "Internal error" }, 500);
  }
}

// POST /api/settings/notifications
export async function POST(req: NextRequest) {
  try {
    const uid = await requireUid();
    if (!uid) return json({ error: "Unauthorized" }, 401);

    const raw = await req.json().catch(() => null);
    if (!raw) return json({ error: "Invalid JSON body" }, 400);

    const parsed = NotifBody.safeParse(raw);
    if (!parsed.success) {
      return json({ error: parsed.error.flatten() }, 400);
    }

    const { productUpdates, weeklyDigest, atsAlerts, marketing } = parsed.data;
    const now = new Date();

    await db
      .insert(userNotificationsTable)
      .values({
        userId: uid,
        productUpdates,
        weeklyDigest,
        atsAlerts,
        marketing,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: userNotificationsTable.userId,
        set: {
          productUpdates,
          weeklyDigest,
          atsAlerts,
          marketing,
          updatedAt: now,
        },
      });

    return json({ ok: true });
  } catch (e: any) {
    console.error("settings/notifications POST error:", e);
    return json({ error: e?.message ?? "Internal error" }, 500);
  }
}
