import { AuthValidationError } from "@/components/auth/auth-errors";
import { emailErrorCode } from "@/components/auth/auth-validation";

const KEY = "dovia_demo_email_verification";
export const OTP_EXPIRY_MS = 120_000;
export const RESEND_COOLDOWN_MS = 60_000;
export const MAX_OTP_ATTEMPTS = 5;
export interface DemoVerification {
  version: 1;
  email: string;
  /** Public demo value, not an authentication secret. Never sent to a provider. */
  demoCode: string;
  expiresAt: number;
  resendAt: number;
  attempts: number;
}
function persist(state: DemoVerification) {
  try { sessionStorage.setItem(KEY, JSON.stringify(state)); }
  catch { throw new Error("Unable to save verification in this tab. Allow browser storage and try again."); }
  return state;
}
export function getPendingVerification(): DemoVerification | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<DemoVerification>;
    if (!value || value.version !== 1 || typeof value.email !== "string" || emailErrorCode(value.email) ||
      typeof value.demoCode !== "string" || !/^\d{6}$/.test(value.demoCode) ||
      typeof value.expiresAt !== "number" || !Number.isFinite(value.expiresAt) ||
      typeof value.resendAt !== "number" || !Number.isFinite(value.resendAt) ||
      typeof value.attempts !== "number" || !Number.isInteger(value.attempts) || value.attempts < 0 || value.attempts > MAX_OTP_ATTEMPTS) {
      throw new Error();
    }
    return value as DemoVerification;
  } catch { throw new Error("Unable to restore this demo verification. Return to Sign Up to start again."); }
}
function issue(email: string, previousCode?: string): DemoVerification {
  const random = crypto.getRandomValues(new Uint32Array(1))[0];
  let demoCode = String(random % 1_000_000).padStart(6, "0");
  if (demoCode === previousCode) demoCode = String((Number(demoCode) + 1) % 1_000_000).padStart(6, "0");
  const now = Date.now();
  return persist({ version: 1, email, demoCode, expiresAt: now + OTP_EXPIRY_MS, resendAt: now + RESEND_COOLDOWN_MS, attempts: 0 });
}
export function beginDemoVerification(email: string) {
  const error = emailErrorCode(email);
  if (error) throw new AuthValidationError(error);
  return issue(email.trim());
}
export function verificationBlock(state: DemoVerification, now = Date.now()) {
  if (state.attempts >= MAX_OTP_ATTEMPTS) return "VERIFICATION_ATTEMPTS_EXCEEDED" as const;
  if (now >= state.expiresAt) return "VERIFICATION_CODE_EXPIRED" as const;
}
export function verifyDemoCode(code: string) {
  const state = getPendingVerification();
  if (!state) throw new AuthValidationError("VERIFICATION_REQUEST_MISSING");
  const blocked = verificationBlock(state);
  if (blocked) throw new AuthValidationError(blocked);
  if (!/^\d{6}$/.test(code)) throw new AuthValidationError("VERIFICATION_CODE_REQUIRED");
  if (state.demoCode !== code) {
    const next = persist({ ...state, attempts: state.attempts + 1 });
    throw new AuthValidationError(next.attempts >= MAX_OTP_ATTEMPTS ? "VERIFICATION_ATTEMPTS_EXCEEDED" : "VERIFICATION_CODE_INVALID");
  }
  try { sessionStorage.removeItem(KEY); }
  catch { throw new Error("Unable to finish demo verification. Allow browser storage and try again."); }
  // No account, credentials, verified identity, or authenticated session is created.
}
export function resendDemoCode() {
  const state = getPendingVerification();
  if (!state) throw new AuthValidationError("VERIFICATION_REQUEST_MISSING");
  if (Date.now() < state.resendAt) throw new AuthValidationError("VERIFICATION_RESEND_COOLDOWN");
  return issue(state.email, state.demoCode);
}
export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  return `${name.slice(0, Math.min(4, Math.max(1, name.length - 1)))}****@${domain}`;
}
