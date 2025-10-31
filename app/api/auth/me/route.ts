// app/api/auth/me/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/config/db";
import { usersTable, refreshTokensTable } from "@/config/schema";
import { eq, and, gt } from "drizzle-orm";
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "@/lib/jwt";
import { sha256 } from "@/lib/crypto";

const isProd = process.env.NODE_ENV === "production";

export async function GET() {
  const jar = cookies(); // ✅ no await
  const session = (await jar).get("session")?.value ?? null;

  let userId: string | null = null;
  let newSessionJwt: string | null = null;

  // 1) Try short-lived access token
  if (session) {
    try {
      const { payload } = await verifyAccessToken(session);
      userId = payload?.sub ? String(payload.sub) : null;
    } catch {
      // fall through to refresh
    }
  }

  // 2) Fallback to refresh -> re-mint session
  if (!userId) {
    const refresh = (await jar).get("refresh")?.value ?? null;
    if (refresh) {
      try {
        const { payload } = await verifyRefreshToken(refresh);
        const uid = String(payload?.sub ?? "");
        const jti = String((payload as any)?.jti ?? ""); // ✅ jti comes from payload

        if (uid && jti) {
          const rec = await db.query.refreshTokensTable.findFirst({
            where: and(
              eq(refreshTokensTable.userId, uid),
              eq(refreshTokensTable.jtiHash, sha256(jti)),
              eq(refreshTokensTable.revoked, false),
              gt(refreshTokensTable.expiresAt, new Date())
            ),
          });

          if (rec) {
            userId = uid;
            // re-issue short-lived session (carry some claims if you want)
            newSessionJwt = await signAccessToken(uid, {
              role: (payload as any)?.role,
              email: (payload as any)?.email,
              name: (payload as any)?.name,
              imageUrl: (payload as any)?.imageUrl,
            });
          }
        }
      } catch {
        // ignore; will return 401 below
      }
    }
  }

  if (!userId) {
    return NextResponse.json(
      { user: null },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 3) Load authoritative user row
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
    columns: { id: true, name: true, email: true, role: true, imageUrl: true },
  });

  if (!user) {
    return NextResponse.json(
      { user: null },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 4) Build response and set a refreshed session if we minted one
  const res = NextResponse.json(
    { user },
    { headers: { "Cache-Control": "no-store" } }
  );

  if (newSessionJwt) {
    res.cookies.set("session", newSessionJwt, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 15, // 15m
    });
  }

  return res;
}
