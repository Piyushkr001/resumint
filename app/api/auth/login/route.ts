export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/config/db";
import { usersTable, refreshTokensTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { randomJti, sha256 } from "@/lib/crypto";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import { attachAuthCookies } from "@/lib/cookies";

export async function POST(req: Request) {
  // 🚫 block if already logged in
  const jar = await cookies();
  const existing = jar.get("refresh")?.value;
  if (existing) {
    try { await verifyRefreshToken(existing); return NextResponse.json({ error: "Already logged in" }, { status: 409 }); }
    catch {}
  }

  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const normalizedEmail = String(email).toLowerCase().trim();

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, normalizedEmail),
  });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  await db.update(usersTable)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(usersTable.id, user.id));

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
    userAgent: (req.headers.get("user-agent") ?? undefined),
    ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0] || undefined,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, imageUrl: user.imageUrl },
  });
  return attachAuthCookies(res, session, refresh);
}
