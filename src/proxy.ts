import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function proxy() {
  const session = await getServerSession(authOptions);
  const isAuthed = !!session?.user;
  const isVerified = (session?.user as { emailVerified?: boolean } | null)?.emailVerified === true;

  return NextResponse.rewrite(
    isAuthed && isVerified
      ? "/dashboard"
      : isAuthed
        ? "/verify-email"
        : "/login"
  );
}

export const config = {
  matcher: ["/dashboard/:path*", "/meetings/:path*", "/tasks/:path*", "/calendar/:path*", "/team/:path*", "/reports/:path*", "/notifications/:path*", "/settings/:path*"],
};
