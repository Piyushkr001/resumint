// lib/cookies.ts
import { NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";

export function attachAuthCookies(res: NextResponse, sessionJwt: string, refreshJwt: string) {
  res.cookies.set("session", sessionJwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,   // false on localhost
    path: "/",
    maxAge: 60 * 15,  // 15m
  });
  res.cookies.set("refresh", refreshJwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7d
  });
  return res;
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set("session", "", { httpOnly: true, sameSite: "lax", secure: isProd, path: "/", maxAge: 0 });
  res.cookies.set("refresh", "", { httpOnly: true, sameSite: "lax", secure: isProd, path: "/", maxAge: 0 });
  return res;
}
