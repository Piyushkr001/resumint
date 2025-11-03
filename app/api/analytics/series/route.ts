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

function daysBetween(from: string, to: string) {
  const start = new Date(from + "T00:00:00Z");
  const end = new Date(to + "T00:00:00Z");
  const out: string[] = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
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
    const metric = (url.searchParams.get("metric") || "views").toLowerCase();
    const { from, to } = clampRange(url.searchParams.get("from"), url.searchParams.get("to"));
    if (!["views", "downloads"].includes(metric)) {
      return json({ error: "Invalid metric. Use 'views' or 'downloads'." }, 400);
    }

    const table = metric === "views" ? atsAnalysesTable : resumesTable;

    const res = await db.execute(sql`
      SELECT date_trunc('day', created_at)::date AS d, COUNT(*)::int AS c
      FROM ${table}
      WHERE user_id = ${uid}
        AND created_at >= ${from}::date
        AND created_at <  (${to}::date + INTERVAL '1 day')
      GROUP BY d
      ORDER BY d
    `);
    const rows = getRows<{ d: string; c: number }>(res);

    const map = new Map(rows.map(r => [r.d.slice(0, 10), Number(r.c)]));
    const series = daysBetween(from, to).map(day => ({ date: day, value: map.get(day) ?? 0 }));

    return json({ metric, from, to, resumeId: null, series });
  } catch (e: any) {
    console.error("analytics/series error:", e);
    return json({ error: e?.message ?? "Internal Error" }, 500);
  }
}
