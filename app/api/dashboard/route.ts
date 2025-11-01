// app/api/dashboard/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq, gt, desc, sql } from "drizzle-orm";
import { db } from "@/config/db";
import {
  usersTable,
  refreshTokensTable,
  // ⬇️ make sure these exist in your schema file
  resumesTable,
} from "@/config/schema";
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "@/lib/jwt";
import { sha256 } from "@/lib/crypto";

const isProd = process.env.NODE_ENV === "production";

type JWTPayload = { sub: string; role?: string; email?: string; name?: string; imageUrl?: string };
type VerifyRefreshTokenResult = { payload: JWTPayload; jti: string };

async function getUserIdFromCookies(): Promise<{ userId: string | null; newSession?: string }> {
  const jar = cookies();
  const session = (await jar).get("session")?.value ?? null;

  // 1) Try short-lived access token first
  if (session) {
    try {
      const { payload } = await verifyAccessToken(session);
      const uid = payload?.sub ?? null;
      if (uid) return { userId: uid };
    } catch {
      // fall through to refresh
    }
  }

  // 2) Try refresh token and re-mint access
  const refresh = (await jar).get("refresh")?.value ?? null;
  if (!refresh) return { userId: null };

  try {
    const { payload, jti } = (await verifyRefreshToken(refresh)) as unknown as VerifyRefreshTokenResult;
    const uid = String(payload?.sub ?? "");
    if (!uid) return { userId: null };

    const rec = await db.query.refreshTokensTable.findFirst({
      where: and(
        eq(refreshTokensTable.userId, uid),
        eq(refreshTokensTable.jtiHash, sha256(jti)),
        eq(refreshTokensTable.revoked, false),
        gt(refreshTokensTable.expiresAt, new Date())
      ),
    });
    if (!rec) return { userId: null };

    const newSession = await signAccessToken(uid, {
      role: payload.role,
      email: payload.email,
      name: payload.name,
      imageUrl: payload.imageUrl,
    });
    return { userId: uid, newSession };
  } catch {
    return { userId: null };
  }
}

export async function GET() {
  const { userId, newSession } = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  // Ensure user still exists
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
    columns: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // ---- KPIs --------------------------------------------------------
  // total resumes
  const [{ totalResumes }] = await db
    .select({ totalResumes: sql<number>`count(*)` })
    .from(resumesTable)
    .where(eq(resumesTable.userId, userId));

  // created this week
  const [{ createdThisWeek }] = await db
    .select({ createdThisWeek: sql<number>`count(*)` })
    .from(resumesTable)
    .where(and(eq(resumesTable.userId, userId), gt(resumesTable.createdAt, weekAgo)));

  // avg ATS (null-safe)
  const [{ avgAts }] =
    await db
      .select({ avgAts: sql<number>`COALESCE(AVG(${resumesTable.atsScore}), 0)` })
      .from(resumesTable)
      .where(eq(resumesTable.userId, userId));

  // distinct templates used
  const [{ templateCount }] =
    await db
      .select({ templateCount: sql<number>`COUNT(DISTINCT ${resumesTable.template})` })
      .from(resumesTable)
      .where(eq(resumesTable.userId, userId));

  const kpis = [
    { label: "Resumes Created", value: Number(totalResumes ?? 0), delta: `+${createdThisWeek ?? 0} this week`, up: (createdThisWeek ?? 0) >= 0 },
    { label: "ATS Avg. Score", value: Math.round(Number(avgAts ?? 0)), delta: "+0", up: true },
    { label: "Templates Used", value: Number(templateCount ?? 0), delta: "+0", up: true },
  ];

  // ---- Recent resumes (top 5) --------------------------------------
  const recent = await db
    .select({
      id: resumesTable.id,
      title: resumesTable.title,
      template: resumesTable.template,
      ats: resumesTable.atsScore,
      updatedAtISO: resumesTable.updatedAt,
    })
    .from(resumesTable)
    .where(eq(resumesTable.userId, userId))
    .orderBy(desc(resumesTable.updatedAt))
    .limit(5);

  // Format for the dashboard UI (string date is fine)
  const resumes = recent.map((r) => ({
    id: r.id,
    title: r.title ?? "Untitled",
    template: r.template ?? "clean",
    ats: r.ats ?? 0,
    updatedAt: new Date(r.updatedAtISO ?? new Date()).toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  // ---- Insights (optional heuristic; keep empty if you want) -------
  const insights = [] as Array<{ name: string; progress: number }>;
  // Example heuristic (uncomment if desired):
  // if (avgAts < 80) insights.push({ name: "Keyword Match", progress: 60 });

  const res = NextResponse.json(
    {
      kpis,
      resumes,
      insights,
    },
    { headers: { "Cache-Control": "no-store" } }
  );

  // Re-attach a fresh short-lived session if we minted one
  if (newSession) {
    res.cookies.set("session", newSession, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 15,
    });
  }

  return res;
}
