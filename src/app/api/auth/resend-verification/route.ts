import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/server/models/user";
import { EmailVerification } from "@/server/models/email-verification";
import { hashOtp, generateOtp } from "@/lib/auth/otp";
import { buildVerificationEmail } from "@/server/email/verification-email";
import { mailer, buildFrom } from "@/server/email/mailer";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: { code: "EMAIL_INVALID", message: "Enter a valid email address." } }, { status: 400 });
    }

    const user = await User.findOne({ emailNormalized: email }).lean();
    if (!user) {
      return NextResponse.json({ success: true, data: { resendAvailableInSeconds: 0 } }, { status: 200 });
    }
    if (user.emailVerifiedAt) {
      return NextResponse.json({ success: true, data: { resendAvailableInSeconds: 0 } }, { status: 200 });
    }

    const active = await EmailVerification.findOne({ emailNormalized: email, purpose: "EMAIL_VERIFICATION" });
    if (active) {
      const now = new Date();
      if (active.consumedAt || now >= active.expiresAt || active.attempts >= active.maxAttempts) {
        await EmailVerification.deleteMany({ emailNormalized: email, purpose: "EMAIL_VERIFICATION" });
      } else if (now < active.resendAvailableAt) {
        const retry = Math.max(0, Math.ceil((active.resendAvailableAt.getTime() - now.getTime()) / 1000));
        return NextResponse.json({ success: true, data: { resendAvailableInSeconds: retry } }, { status: 200 });
      }
    }

    await EmailVerification.deleteMany({ emailNormalized: email, purpose: "EMAIL_VERIFICATION" });
    const otp = generateOtp();
    const otpHash = hashOtp(email, otp);
    const now = new Date();
    const verification = new EmailVerification({
      emailNormalized: email,
      purpose: "EMAIL_VERIFICATION",
      otpHash,
      expiresAt: new Date(now.getTime() + 2 * 60 * 1000),
      resendAvailableAt: new Date(now.getTime() + 60 * 1000),
      attempts: 0,
      maxAttempts: 5,
    });
    await verification.save();

    const firstName = String(user.name).split(" ")[0] || String(user.name);
    const verifyUrl = `${process.env.APP_URL || "http://localhost:3000"}/verify-email`;
    const { subject, plainText, html } = buildVerificationEmail({
      firstName,
      otp,
      expiresInSeconds: 120,
      verifyUrl,
    });

    try {
      await mailer.sendMail({ from: buildFrom(), to: user.email, subject, text: plainText, html });
    } catch {
      return NextResponse.json({ success: false, error: { code: "EMAIL_DELIVERY_FAILED", message: "We could not resend the verification email." } }, { status: 502 });
    }

    return NextResponse.json({ success: true, data: { expiresInSeconds: 120, resendAvailableInSeconds: 60 } }, { status: 200 });
  } catch (error) {
    console.error("resend-verification error", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Resend failed. Please try again." } }, { status: 500 });
  }
}
