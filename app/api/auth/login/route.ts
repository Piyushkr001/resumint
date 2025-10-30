// app/api/auth/login/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { usersTable, refreshTokensTable } from "@/config/schema";
import { randomJti, sha256 } from "@/lib/crypto";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { attachAuthCookies } from "@/lib/cookies";
import { db } from "@/config/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, normalizedEmail),
  });
  if (!user || !user.passwordHash) {
    // passwordHash missing usually means social-only account
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // update last login
  await db.update(usersTable)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(usersTable.id, user.id));

  // mint tokens
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

  // build response and ATTACH cookies to it
  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, imageUrl: user.imageUrl },
  });
  return attachAuthCookies(res, session, refresh);
}
