import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/config/db";
import { verifyAccessToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

async function requireUid(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await verifyAccessToken(token);
    return payload?.sub ? String(payload.sub) : null;
  } catch { return null; }
}

function clampRange(fromQ?: string | null, toQ?: string | null) {
  const today = new Date();
  const to = toQ ?? new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
    .toISOString().slice(0, 10);
  let from = fromQ;
  if (!from) {
    const d = new Date(to + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - 29);
    from = d.toISOString().slice(0, 10);
  }
  return { from, to };
}

function getRows<T>(res: any): T[] {
  if (Array.isArray(res)) return res as T[];
  if (Array.isArray(res?.rows)) return res.rows as T[];
  return [];
}

export async function GET(req: Request) {
  try {
    const uid = await requireUid();
    if (!uid) return json({ error: "Unauthorized" }, 401);

    const url = new URL(req.url);
    const { from, to } = clampRange(url.searchParams.get("from"), url.searchParams.get("to"));
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 16)));

    // ⚠️ FIX: Use expression in GROUP BY/HAVING (not the alias), and COALESCE arrays.
    const rMatched = await db.execute(sql`
      SELECT LOWER(TRIM(k)) AS keyword, COUNT(*)::int AS count
      FROM ats_analyses, UNNEST(COALESCE(matched, ARRAY[]::text[])) AS k
      WHERE user_id = ${uid}
        AND created_at >= ${from}::date
        AND created_at <  (${to}::date + INTERVAL '1 day')
      GROUP BY LOWER(TRIM(k))
      HAVING LOWER(TRIM(k)) <> ''
      ORDER BY count DESC, keyword ASC
      LIMIT ${limit}
    `);

    const rMissing = await db.execute(sql`
      SELECT LOWER(TRIM(k)) AS keyword, COUNT(*)::int AS count
      FROM ats_analyses, UNNEST(COALESCE(missing, ARRAY[]::text[])) AS k
      WHERE user_id = ${uid}
        AND created_at >= ${from}::date
        AND created_at <  (${to}::date + INTERVAL '1 day')
      GROUP BY LOWER(TRIM(k))
      HAVING LOWER(TRIM(k)) <> ''
      ORDER BY count DESC, keyword ASC
      LIMIT ${limit}
    `);

    const rExtras = await db.execute(sql`
      SELECT LOWER(TRIM(k)) AS keyword, COUNT(*)::int AS count
      FROM ats_analyses, UNNEST(COALESCE(extras, ARRAY[]::text[])) AS k
      WHERE user_id = ${uid}
        AND created_at >= ${from}::date
        AND created_at <  (${to}::date + INTERVAL '1 day')
      GROUP BY LOWER(TRIM(k))
      HAVING LOWER(TRIM(k)) <> ''
      ORDER BY count DESC, keyword ASC
      LIMIT ${limit}
    `);

    return json({
      range: { from, to },
      matched: getRows<{ keyword: string; count: number }>(rMatched),
      missing: getRows<{ keyword: string; count: number }>(rMissing),
      extras: getRows<{ keyword: string; count: number }>(rExtras),
    });
  } catch (e: any) {
    console.error("analytics/keywords error:", e);
    return json({ error: e?.message ?? "Internal Error" }, 500);
  }
}
