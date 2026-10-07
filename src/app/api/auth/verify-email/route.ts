import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/server/models/user";
import { EmailVerification } from "@/server/models/email-verification";
import { Workspace } from "@/server/models/workspace";
import { Membership } from "@/server/models/membership";

import { verifyOtp } from "@/lib/auth/otp";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const code = String(body.code ?? "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: { code: "EMAIL_INVALID", message: "Enter a valid email address." } }, { status: 400 });
    }
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ success: false, error: { code: "VERIFICATION_CODE_REQUIRED", message: "Enter the 6-digit verification code." } }, { status: 400 });
    }

    const user = await User.findOne({ emailNormalized: email }).select("+passwordHash").lean();
    if (!user) {
      return NextResponse.json({ success: false, error: { code: "VERIFICATION_REQUEST_NOT_FOUND", message: "We could not find a pending verification for this email." } }, { status: 404 });
    }
    if (user.emailVerifiedAt) {
      return NextResponse.json({ success: false, error: { code: "EMAIL_ALREADY_VERIFIED", message: "This email is already verified." } }, { status: 400 });
    }

    const verification = await EmailVerification.findOne({ emailNormalized: email, purpose: "EMAIL_VERIFICATION" });
    if (!verification) {
      return NextResponse.json({ success: false, error: { code: "VERIFICATION_REQUEST_NOT_FOUND", message: "Verification code expired or was not found. Request a new one." } }, { status: 404 });
    }
    if (verification.consumedAt) {
      return NextResponse.json({ success: false, error: { code: "VERIFICATION_CODE_INVALID", message: "This verification code has already been used." } }, { status: 400 });
    }
    if (new Date() >= verification.expiresAt) {
      return NextResponse.json({ success: false, error: { code: "VERIFICATION_CODE_EXPIRED", message: "This verification code has expired. Request a new one." } }, { status: 400 });
    }
    if (verification.attempts >= verification.maxAttempts) {
      return NextResponse.json({ success: false, error: { code: "VERIFICATION_ATTEMPTS_EXCEEDED", message: "Too many failed attempts. Request a new code." } }, { status: 429 });
    }

    const isValid = verifyOtp(email, code, verification.otpHash);
    if (!isValid) {
      verification.attempts += 1;
      await verification.save();
      return NextResponse.json({ success: false, error: { code: "VERIFICATION_CODE_INVALID", message: "Invalid verification code." } }, { status: 400 });
    }

    await User.updateOne({ _id: user._id }, { $set: { emailVerifiedAt: new Date() } });
    verification.consumedAt = new Date();
    await verification.save();

    const workspaceName = user.name.split(" ")[0] + "'s Workspace";
    const baseSlug = `${user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-workspace`;
    const workspace = await Workspace.findOne({ slug: baseSlug });
    const slug = workspace ? `${baseSlug}-${user._id.toString()}` : baseSlug;
    const newWorkspace = await Workspace.create({ name: workspaceName, slug, ownerId: user._id });
    await Membership.create({ workspaceId: newWorkspace._id, userId: user._id, role: "OWNER", status: "ACTIVE" });

    return NextResponse.json({ success: true, data: { verified: true } }, { status: 200 });
  } catch (error) {
    console.error("verify-email error", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Verification failed. Please try again." } }, { status: 500 });
  }
}
