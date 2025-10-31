import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/jwt";
import { sha256 } from "@/lib/crypto";
import { and, eq } from "drizzle-orm";
import { refreshTokensTable } from "@/config/schema";
import { clearAuthCookies } from "@/lib/cookies";
import { db } from "@/config/db";

export async function POST() {
  const jar = await cookies();
  const refresh = jar.get("refresh")?.value;

  if (refresh) {
    try {
      const { payload } = await verifyRefreshToken(refresh);
      const jtiHash = sha256(String(payload.jti));
      await db.update(refreshTokensTable)
        .set({ revoked: true })
        .where(and(
          eq(refreshTokensTable.userId, String(payload.sub)),
          eq(refreshTokensTable.jtiHash, jtiHash),
          eq(refreshTokensTable.revoked, false),
        ));
    } catch { /* ignore */ }
  }

  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
