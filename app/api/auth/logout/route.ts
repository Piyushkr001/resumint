// app/api/auth/logout/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/jwt";
import { sha256 } from "@/lib/crypto";
import { and, eq } from "drizzle-orm";
import { refreshTokensTable } from "@/config/schema";
import { clearAuthCookies } from "@/lib/cookies";
import { db } from "@/config/db";

export async function POST() {
  const jar = cookies();
  const refresh = (await jar).get("refresh")?.value;

  if (refresh) {
    try {
      const out = await verifyRefreshToken(refresh);
      const userId = String(out?.payload?.sub ?? "");
      const jti = (out as any)?.jti ?? String(out?.payload?.jti ?? "");
      if (userId && jti) {
        await db
          .update(refreshTokensTable)
          .set({ revoked: true })
          .where(
            and(
              eq(refreshTokensTable.userId, userId),
              eq(refreshTokensTable.jtiHash, sha256(jti)),
              eq(refreshTokensTable.revoked, false)
            )
          );
      }
    } catch {
      // ignore invalid/expired refresh token
    }
  }

  // IMPORTANT: attach cookie clears to the SAME response you return
  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  return clearAuthCookies(res); // <- this must mutate and return `res`
}
