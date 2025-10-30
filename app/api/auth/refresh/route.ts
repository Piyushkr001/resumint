// app/api/auth/refresh/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, signAccessToken } from "@/lib/jwt";
import { refreshTokensTable, usersTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { sha256 } from "@/lib/crypto";
import { db } from "@/config/db";

const isProd = process.env.NODE_ENV === "production";

export async function POST() {
  const jar = cookies();
  const refresh = (await jar).get("refresh")?.value;
  if (!refresh) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const out = await verifyRefreshToken(refresh);
    const userId = String(out?.payload?.sub ?? "");
    const jti = (out as any)?.jti ?? String(out?.payload?.jti ?? "");
    if (!userId || !jti) {
      return NextResponse.json({ error: "Invalid refresh" }, { status: 401 });
    }

    // Validate stored refresh token
    const tokenRow = await db.query.refreshTokensTable.findFirst({
      where: and(
        eq(refreshTokensTable.userId, userId),
        eq(refreshTokensTable.jtiHash, sha256(jti)),
        eq(refreshTokensTable.revoked, false)
      ),
    });

    if (!tokenRow || tokenRow.expiresAt < new Date()) {
      return NextResponse.json({ error: "Refresh expired" }, { status: 401 });
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      columns: { id: true, email: true, role: true, name: true, imageUrl: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Mint new short-lived access (session) token
    const session = await signAccessToken(user.id, {
      role: user.role,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
    });

    // Build response and ATTACH the session cookie to it
    const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    res.cookies.set("session", session, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd, // false on localhost
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    // (Optional) Rotate refresh token here instead of reusing:
    // - generate new jti & refresh
    // - insert new row & revoke old one
    // - set new 'refresh' cookie on res

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid refresh" }, { status: 401 });
  }
}
