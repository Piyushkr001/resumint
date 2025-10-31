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

  const { name, email, password } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const normalizedEmail = String(email).toLowerCase().trim();
  const exists = await db.query.usersTable.findFirst({ where: eq(usersTable.email, normalizedEmail) });
  if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(usersTable)
    .values({ name, email: normalizedEmail, passwordHash, provider: "password" })
    .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role, imageUrl: usersTable.imageUrl });

  const jti = randomJti();
  const access = await signAccessToken(user.id, { role: user.role, email: user.email, name: user.name });
  const refresh = await signRefreshToken(user.id, jti);

  await db.insert(refreshTokensTable).values({
    userId: user.id,
    jtiHash: sha256(jti),
    userAgent: (req.headers.get("user-agent") ?? undefined),
    ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0] || undefined,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const res = NextResponse.json({ user });
  return attachAuthCookies(res, access, refresh);
}
