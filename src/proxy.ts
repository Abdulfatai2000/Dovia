import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function proxy(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAuthed = !!session?.user;
  const isVerified = (session?.user as { emailVerified?: boolean } | null)?.emailVerified === true;

  if (isAuthed && isVerified) return NextResponse.next();

  const destination = new URL(isAuthed ? "/verify-email" : "/login", request.url);
  if (isAuthed && session?.user.email) {
    destination.searchParams.set("email", session.user.email);
  }
  return NextResponse.redirect(destination);
}

export const config = {
  matcher: ["/dashboard/:path*", "/meetings/:path*", "/tasks/:path*", "/calendar/:path*", "/team/:path*", "/reports/:path*", "/notifications/:path*", "/settings/:path*"],
};
