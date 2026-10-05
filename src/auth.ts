import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/server/models/user";
import { Membership } from "@/server/models/membership";
import { MembershipRole } from "@/server/constants";
import { serverEnv } from "@/lib/env.server";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        await connectToDatabase();
        const user = await User.findOne({ emailNormalized: email }).select("+passwordHash");
        if (!user) return null;
        if (!user.emailVerifiedAt) {
          return { id: user._id.toString(), email: user.email, name: user.name, emailVerified: false };
        }
        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        const membership = await Membership.findOne({ userId: user._id, status: "ACTIVE" }).sort({ createdAt: 1 }).lean();
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          emailVerified: true,
          workspaceId: membership?.workspaceId.toString(),
          workspaceRole: membership?.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? session.user.id;
        session.user.emailVerified = (token as { emailVerified?: boolean }).emailVerified ?? session.user.emailVerified;
        session.user.workspaceId = (token as { workspaceId?: string }).workspaceId;
        session.user.workspaceRole = (token as { workspaceRole?: string }).workspaceRole;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.emailVerified = (user as { emailVerified?: boolean }).emailVerified ?? token.emailVerified;
        token.workspaceId = (user as { workspaceId?: string }).workspaceId;
        token.workspaceRole = (user as { workspaceRole?: string }).workspaceRole;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: serverEnv.AUTH_SECRET,
};
