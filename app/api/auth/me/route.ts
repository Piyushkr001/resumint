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

// Define the expected payload type
interface JWTPayload {
  sub: string;
  role?: string;
  email?: string;
  name?: string;
  imageUrl?: string;
}

// Update the return type of verifyRefreshToken
interface VerifyRefreshTokenResult {
  payload: JWTPayload;
  jti: string; // Ensure jti is included
}

export async function GET() {
  const jar = cookies();
  const session = (await jar).get("session")?.value;

  let userId: string | null = null;
  let newSessionJwt: string | null = null;

  // 1) Try short-lived session first
  if (session) {
    try {
      const { payload } = await verifyAccessToken(session); // jose.jwtVerify-like -> { payload }
      userId = payload?.sub ?? null;
    } catch {
      // fall through to refresh
    }
  }

  // 2) Fallback: use refresh cookie to re-mint session
  if (!userId) {
    const refresh = (await jar).get("refresh")?.value;
    if (refresh) {
      try {
        // Cast the result to the updated type
        const { payload, jti } = await verifyRefreshToken(refresh) as unknown as VerifyRefreshTokenResult;
        const uid = String(payload?.sub ?? "");

        // Make sure this refresh is valid (not revoked, not expired)
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
          // re-issue a short-lived session
          newSessionJwt = await signAccessToken(uid, {
            role: payload.role,
            email: payload.email,
            name: payload.name,
            imageUrl: payload.imageUrl,
          });
        }
      } catch {
        // ignore -> userId stays null
      }
    }
  }

  if (!userId) {
    return NextResponse.json(
      { user: null },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 3) Load a fresh, authoritative user row
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

  // 4) Build response (and set a new session cookie if we minted one)
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
      maxAge: 60 * 15, // 15 minutes
    });
  }

  return res;
}