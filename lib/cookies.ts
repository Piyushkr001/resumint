import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";

// Set when you *don't* already have a NextResponse
export async function setAuthCookies(access: string, refresh: string) {
  const jar = await cookies();
  jar.set("session", access,  { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 60 * 15 });
  jar.set("refresh", refresh, { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

// Attach to an existing NextResponse (preferred in API routes)
export function attachAuthCookies(res: NextResponse, access: string, refresh: string) {
  res.cookies.set("session", access,  { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 60 * 15 });
  res.cookies.set("refresh", refresh, { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.set("session", "", { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 0 });
  jar.set("refresh", "", { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 0 });
}
