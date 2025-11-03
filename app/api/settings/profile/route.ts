import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/config/db";
import { usersTable, userProfilesTable } from "@/config/schema"; // 👈 updated
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

const ProfileBody = z.object({
  name: z.string().min(2),
  bio: z.string().max(280).optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

// GET /api/settings/profile
export async function GET(_req: NextRequest) {
  try {
    const uid = await requireUid();
    if (!uid) return json({ error: "Unauthorized" }, 401);

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, uid),
    });
    if (!user) return json({ error: "User not found" }, 404);

    const profile = await db.query.userProfilesTable.findFirst({
      where: eq(userProfilesTable.userId, uid),
    });

    return json({
      name: user.name,
      email: user.email,
      bio: profile?.bio ?? "",
      website: profile?.website ?? "",
      avatar: user.imageUrl ?? null,
    });
  } catch (e: any) {
    console.error("settings/profile GET error:", e);
    return json({ error: e?.message ?? "Internal error" }, 500);
  }
}

// POST /api/settings/profile
export async function POST(req: NextRequest) {
  try {
    const uid = await requireUid();
    if (!uid) return json({ error: "Unauthorized" }, 401);

    const raw = await req.json().catch(() => null);
    if (!raw) return json({ error: "Invalid JSON body" }, 400);

    const parsed = ProfileBody.safeParse(raw);
    if (!parsed.success) {
      return json({ error: parsed.error.flatten() }, 400);
    }
    const { name, bio, website } = parsed.data;

    // Update user table (name)
    await db
      .update(usersTable)
      .set({ name, updatedAt: new Date() })
      .where(eq(usersTable.id, uid));

    // Upsert into userProfilesTable
    const now = new Date();
    await db
      .insert(userProfilesTable)
      .values({
        userId: uid,
        bio: bio ?? "",
        website: website ?? "",
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: userProfilesTable.userId,
        set: {
          bio: bio ?? "",
          website: website ?? "",
          updatedAt: now,
        },
      });

    return json({ ok: true });
  } catch (e: any) {
    console.error("settings/profile POST error:", e);
    return json({ error: e?.message ?? "Internal error" }, 500);
  }
}
