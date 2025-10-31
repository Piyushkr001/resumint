import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRemoteJWKSet, jwtVerify, decodeJwt, JWTPayload } from "jose";
import { db } from "@/config/db";
import { usersTable, refreshTokensTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { randomJti, sha256 } from "@/lib/crypto";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import { attachAuthCookies } from "@/lib/cookies";

export const runtime = "nodejs";

const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const GOOGLE_AUD = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "").trim();

export async function POST(req: Request) {
  if (!GOOGLE_AUD) return NextResponse.json({ error: "Server misconfigured: missing Google client ID" }, { status: 500 });

  // 🚫 block if already logged in
  const jar = await cookies();
  const existing = jar.get("refresh")?.value;
  if (existing) {
    try { await verifyRefreshToken(existing); return NextResponse.json({ error: "Already logged in" }, { status: 409 }); }
    catch {}
  }

  const { credential } = await req.json().catch(() => ({}));
  if (!credential) return NextResponse.json({ error: "Missing credential" }, { status: 400 });

  if (process.env.NODE_ENV !== "production") {
    try {
      const dbg = decodeJwt(credential);
      console.log("[google-credential] aud:", (dbg as any).aud, "iss:", (dbg as any).iss, "envAUD:", GOOGLE_AUD);
    } catch {}
  }

  let payload: JWTPayload & { email?: string; email_verified?: boolean; name?: string; picture?: string; sub?: string };
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
    if (!email || !sub) return NextResponse.json({ error: "Google did not return email/sub" }, { status: 400 });

    const emailVerified = Boolean(payload.email_verified);
    const name = String(payload.name ?? "Google User");
    const picture = String(payload.picture ?? "");

    // Prefer providerId match; fallback email
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
      const created = await db
        .insert(usersTable)
        .values({
          name,
          email,
          provider: "google",
          providerId: sub,
          passwordHash: null,
          imageUrl: picture || null,
          emailVerifiedAt: emailVerified ? new Date() : null,
        })
        .onConflictDoNothing({ target: usersTable.email })
        .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role, imageUrl: usersTable.imageUrl });

      user =
        created?.[0] ??
        (await db.query.usersTable.findFirst({
          where: eq(usersTable.email, email),
          columns: { id: true, name: true, email: true, role: true, imageUrl: true },
        }));
    } else {
      await db.update(usersTable)
        .set({
          provider: "google",
          providerId: sub,
          imageUrl: user.imageUrl ?? (picture || null),
          emailVerifiedAt: emailVerified ? new Date() : null,
          lastLoginAt: new Date(),
        })
        .where(eq(usersTable.id, user.id));
    }

    if (!user) return NextResponse.json({ error: "Failed to create or fetch user" }, { status: 500 });

    const jti = randomJti();
    const access = await signAccessToken(user.id, { role: user.role, email: user.email });
    const refresh = await signRefreshToken(user.id, jti);

    await db.insert(refreshTokensTable).values({
      userId: user.id,
      jtiHash: sha256(jti),
      userAgent: req.headers.get("user-agent") ?? undefined,
      ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0] || undefined,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const res = NextResponse.json({ user });
    return attachAuthCookies(res, access, refresh);
  } catch (err) {
    console.error("[google-credential] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
