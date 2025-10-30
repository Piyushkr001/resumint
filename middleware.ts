import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const p = req.nextUrl.pathname;

  // apply only on auth pages
  if (p === "/login" || p === "/signup") {
    res.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  }
  return res;
}

export const config = {
  matcher: ["/login", "/signup"],
};
