// app/api/auth/google-credential/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify, decodeJwt, JWTPayload } from "jose";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { usersTable, refreshTokensTable } from "@/config/schema";
import { randomJti, sha256 } from "@/lib/crypto";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { attachAuthCookies } from "@/lib/cookies"; // ✅ use attach-to-response helper

const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const GOOGLE_AUD = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "").trim();

export async function POST(req: Request) {
  if (!GOOGLE_AUD) {
    return NextResponse.json({ error: "Server misconfigured: missing Google client ID" }, { status: 500 });
  }

  const { credential } = await req.json().catch(() => ({}));
  if (!credential) {
    return NextResponse.json({ error: "Missing credential" }, { status: 400 });
  }

  // Debug (dev only)
  if (process.env.NODE_ENV !== "production") {
    try {
      const dbg = decodeJwt(credential);
      console.log("[google-credential] token.aud:", (dbg as any).aud, "iss:", (dbg as any).iss, "envAUB:", GOOGLE_AUD);
    } catch {}
  }

  // Verify Google token
  let payload: JWTPayload & {
    email?: string; email_verified?: boolean; name?: string; picture?: string; sub?: string;
  };
  try {
    const res = await jwtVerify(credential, GOOGLE_JWKS, {
      audience: GOOGLE_AUD,
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      algorithms: ["RS256"],
      clockTolerance: 5,
    });
    payload = res.payload as typeof payload;
  } catch (err: any) {
    const reason = err?.message || "verify_failed";
    if (process.env.NODE_ENV !== "production") {
      console.error("[google-credential] verify failed:", reason);
      return NextResponse.json({ error: "Invalid Google credential", reason }, { status: 401 });
    }
    return NextResponse.json({ error: "Invalid Google credential" }, { status: 401 });
  }

  try {
    const email = String(payload.email ?? "").toLowerCase();
    const sub = String(payload.sub ?? "");
    if (!email || !sub) {
      return NextResponse.json({ error: "Google did not return email/sub" }, { status: 400 });
    }

    const emailVerified = Boolean(payload.email_verified);
    const name = String(payload.name ?? "Google User");
    const picture = String(payload.picture ?? "");

    // Prefer providerId lookup; fallback to email for linking
    let user =
      (await db.query.usersTable.findFirst({
        where: eq(usersTable.providerId, sub),
        columns: { id: true, name: true, email: true, role: true, imageUrl: true },
      })) ??
      (await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
        columns: { id: true, name: true, email: true, role: true, imageUrl: true },
      }));

    if (!user) {
      // New Google-only user
      const created = await db
        .insert(usersTable)
        .values({
          name,
          email,
          provider: "google",       // <- make sure this column exists
          providerId: sub,          // <- and this one too
          passwordHash: null,       // <- nullable for social accounts
          imageUrl: picture || null,
          emailVerifiedAt: emailVerified ? new Date() : null,
          lastLoginAt: new Date(),
        })
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          role: usersTable.role,
          imageUrl: usersTable.imageUrl,
        });

      user = created?.[0];
    } else {
      // Link existing account to Google (idempotent) and refresh profile bits
      await db
        .update(usersTable)
        .set({
          provider: "google",
          providerId: sub,
          imageUrl: user.imageUrl ?? (picture || null),
          emailVerifiedAt: emailVerified ? new Date() : null,
          lastLoginAt: new Date(),
        })
        .where(eq(usersTable.id, user.id));
    }

    if (!user) {
      return NextResponse.json({ error: "Failed to create or fetch user" }, { status: 500 });
    }

    // Issue tokens & persist refresh
    const jti = randomJti();
    const session = await signAccessToken(user.id, {
      role: user.role,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
    });
    const refresh = await signRefreshToken(user.id, jti);

    await db.insert(refreshTokensTable).values({
      userId: user.id,
      jtiHash: sha256(jti),
      userAgent: req.headers.get("user-agent") ?? undefined,
      ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0] || undefined,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // ✅ Attach cookies to the *same* response we return
    const res = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, imageUrl: user.imageUrl },
    });
    return attachAuthCookies(res, session, refresh);
  } catch (err) {
    console.error("[google-credential] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
