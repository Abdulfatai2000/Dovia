import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/server/models/user";
import { EmailVerification } from "@/server/models/email-verification";
import { serverEnv } from "@/lib/env.server";
import { hashOtp, generateOtp } from "@/lib/auth/otp";
import { buildVerificationEmail } from "@/server/email/verification-email";
import { mailer, buildFrom } from "@/server/email/mailer";

function strongPasswordErrors(password: string) {
  const errors: string[] = [];
  if (password.length < 8) errors.push("PASSWORD_TOO_SHORT");
  if (!/[A-Z]/.test(password)) errors.push("PASSWORD_NO_UPPERCASE");
  if (!/[a-z]/.test(password)) errors.push("PASSWORD_NO_LOWERCASE");
  if (!/[0-9]/.test(password)) errors.push("PASSWORD_NO_NUMBER");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("PASSWORD_NO_SPECIAL_CHAR");
  return errors;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    const passwordErrors = strongPasswordErrors(password);
    if (!name) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Name is required." } }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ success: false, error: { code: "EMAIL_INVALID", message: "Enter a valid email address." } }, { status: 400 });
    if (passwordErrors.length) return NextResponse.json({ success: false, error: { code: "PASSWORD_TOO_WEAK", message: "Password does not meet security requirements.", details: passwordErrors } }, { status: 400 });

    const existing = await User.findOne({ emailNormalized: email }).select("+passwordHash");
    if (existing && existing.emailVerifiedAt) {
      return NextResponse.json({ success: false, error: { code: "EMAIL_ALREADY_REGISTERED", message: "An account already exists with this email address. Sign in instead." } }, { status: 409 });
    }

    const passwordHash = await User.hashPassword(password);
    let user = existing;
    if (!user) {
      user = new User({ name, email: email.toLowerCase(), emailNormalized: email.toLowerCase(), passwordHash });
    } else {
      user.name = name;
      user.email = email.toLowerCase();
      user.emailNormalized = email.toLowerCase();
      user.passwordHash = passwordHash;
    }
    await user.save();

    await EmailVerification.deleteMany({ emailNormalized: user.emailNormalized, purpose: "EMAIL_VERIFICATION" });
    const otp = generateOtp();
    const otpHash = hashOtp(user.emailNormalized, otp);
    const now = new Date();
    const verification = new EmailVerification({
      emailNormalized: user.emailNormalized,
      purpose: "EMAIL_VERIFICATION",
      otpHash,
      expiresAt: new Date(now.getTime() + 2 * 60 * 1000),
      resendAvailableAt: new Date(now.getTime() + 60 * 1000),
      attempts: 0,
      maxAttempts: 5,
    });
    await verification.save();

    const firstName = name.split(" ")[0] || name;
    const verifyUrl = `${serverEnv.APP_URL}/verify-email?${new URLSearchParams({ email: user.emailNormalized })}`;
    const { subject, plainText, html } = buildVerificationEmail({
      firstName,
      otp,
      expiresInSeconds: 120,
      verifyUrl,
    });

    try {
      await mailer.sendMail({
        from: buildFrom(),
        to: user.email,
        subject,
        text: plainText,
        html,
      });
    } catch {
      return NextResponse.json({ success: false, error: { code: "EMAIL_DELIVERY_FAILED", message: "We could not send the verification email. Please try again later." } }, { status: 502 });
    }

    return NextResponse.json({ success: true, data: { email: user.email, verificationSentAt: now.toISOString() } }, { status: 201 });
  } catch (error) {
    console.error("register error", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Registration failed. Please try again." } }, { status: 500 });
  }
}
