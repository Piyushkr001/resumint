import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/config/db";
import { resumesTable, atsAnalysesTable } from "@/config/schema";
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

    // views (proxy = ats_analyses count)
    const resViews = await db.execute(sql`
      SELECT COUNT(*)::int AS views
      FROM ${atsAnalysesTable}
      WHERE user_id = ${uid}
        AND created_at >= ${from}::date
        AND created_at <  (${to}::date + INTERVAL '1 day')
    `);
    const views = Number(getRows<{ views: number }>(resViews)[0]?.views ?? 0);

    // downloads (proxy = resumes created)
    const resDl = await db.execute(sql`
      SELECT COUNT(*)::int AS downloads
      FROM ${resumesTable}
      WHERE user_id = ${uid}
        AND created_at >= ${from}::date
        AND created_at <  (${to}::date + INTERVAL '1 day')
    `);
    const downloads = Number(getRows<{ downloads: number }>(resDl)[0]?.downloads ?? 0);

    // template share
    const resTpl = await db.execute(sql`
      SELECT template::text AS template, COUNT(*)::int AS value
      FROM ${resumesTable}
      WHERE user_id = ${uid}
        AND created_at >= ${from}::date
        AND created_at <  (${to}::date + INTERVAL '1 day')
      GROUP BY template
      ORDER BY value DESC
    `);
    const templateShare = getRows<{ template: "clean"|"modern"|"minimal"|"elegant"; value: number }>(resTpl);

    // ATS aggregates
    const resAts = await db.execute(sql`
      SELECT COALESCE(ROUND(AVG(score))::int, 0) AS avg_score,
             MAX(created_at) AS last_at,
             COUNT(*)::int AS cnt
      FROM ${atsAnalysesTable}
      WHERE user_id = ${uid}
        AND created_at >= ${from}::date
        AND created_at <  (${to}::date + INTERVAL '1 day')
    `);
    const rowAts = getRows<{ avg_score: number; last_at: string | null; cnt: number }>(resAts)[0] ?? { avg_score: 0, last_at: null, cnt: 0 };

    return json({
      range: { from, to },
      totals: { views, downloads },
      templateShare,
      ats: { avgScore: rowAts.avg_score ?? 0, lastAnalysisAt: rowAts.last_at ?? null, count: rowAts.cnt ?? 0 },
    });
  } catch (e: any) {
    console.error("analytics/summary error:", e);
    return json({ error: e?.message ?? "Internal Error" }, 500);
  }
}
