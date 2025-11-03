import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/config/db";
import { userPreferencesTable } from "@/config/schema"; // 👈 updated
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

const PrefBody = z.object({
  theme: z.enum(["system", "light", "dark"]),
  locale: z.enum(["en", "hi", "fr", "de", "es"]),
  density: z.enum(["comfortable", "compact"]),
});

// GET /api/settings/preferences
export async function GET(_req: NextRequest) {
  try {
    const uid = await requireUid();
    if (!uid) return json({ error: "Unauthorized" }, 401);

    const row = await db.query.userPreferencesTable.findFirst({
      where: eq(userPreferencesTable.userId, uid),
    });

    return json({
      theme: row?.theme ?? "system",
      locale: row?.locale ?? "en",
      density: row?.density ?? "comfortable",
    });
  } catch (e: any) {
    console.error("settings/preferences GET error:", e);
    return json({ error: e?.message ?? "Internal error" }, 500);
  }
}

// POST /api/settings/preferences
export async function POST(req: NextRequest) {
  try {
    const uid = await requireUid();
    if (!uid) return json({ error: "Unauthorized" }, 401);

    const raw = await req.json().catch(() => null);
    if (!raw) return json({ error: "Invalid JSON body" }, 400);

    const parsed = PrefBody.safeParse(raw);
    if (!parsed.success) {
      return json({ error: parsed.error.flatten() }, 400);
    }

    const { theme, locale, density } = parsed.data;
    const now = new Date();

    await db
      .insert(userPreferencesTable)
      .values({ userId: uid, theme, locale, density, updatedAt: now })
      .onConflictDoUpdate({
        target: userPreferencesTable.userId,
        set: { theme, locale, density, updatedAt: now },
      });

    return json({ ok: true });
  } catch (e: any) {
    console.error("settings/preferences POST error:", e);
    return json({ error: e?.message ?? "Internal error" }, 500);
  }
}
