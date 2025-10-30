// app/api/auth/signup/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { usersTable, refreshTokensTable } from "@/config/schema";
import { randomJti, sha256 } from "@/lib/crypto";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { attachAuthCookies } from "@/lib/cookies"; // ✅ use attach helper
import { db } from "@/config/db";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  // Check if email already exists
  const existing = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, normalizedEmail),
    columns: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  // Hash & create user (ensure passwordHash in schema is NOT NULL for password accounts)
  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email: normalizedEmail,
      passwordHash,
      // If you have provider/providerId columns:
      // provider: "password",
      // providerId: null,
    })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      imageUrl: usersTable.imageUrl,
    });

  // Mint tokens
  const jti = randomJti();
  const session = await signAccessToken(user.id, {
    role: user.role,
    email: user.email,
    name: user.name,
    imageUrl: user.imageUrl,
  });
  const refresh = await signRefreshToken(user.id, jti);

  // Persist refresh (hashed)
  await db.insert(refreshTokensTable).values({
    userId: user.id,
    jtiHash: sha256(jti),
    userAgent: req.headers.get("user-agent") ?? undefined,
    ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0] || undefined,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // ✅ Attach cookies to the SAME response
  const res = NextResponse.json(
    { user },
    { status: 201, headers: { "Cache-Control": "no-store" } }
  );
  return attachAuthCookies(res, session, refresh);
}
