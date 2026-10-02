import { NextResponse } from "next/server";

// Next.js 16 proxy convention. No authentication enforcement in Phase 0.
// TODO: Protect /dashboard, /meetings, /tasks, /calendar, /team, /reports,
// /notifications, and /settings after Auth.js is configured.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/meetings/:path*", "/tasks/:path*", "/calendar/:path*", "/team/:path*", "/reports/:path*", "/notifications/:path*", "/settings/:path*"],
};
