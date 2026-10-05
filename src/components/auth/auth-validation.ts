export const MIN_PASSWORD_LENGTH = 8;
import { authErrorMessages, type AuthErrorCode } from "./auth-errors";

export const passwordRules = [
  { code: "PASSWORD_TOO_SHORT", label: "At least 8 characters", test: (value: string) => value.length >= MIN_PASSWORD_LENGTH },
  { code: "PASSWORD_NO_UPPERCASE", label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { code: "PASSWORD_NO_LOWERCASE", label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { code: "PASSWORD_NO_NUMBER", label: "One number", test: (value: string) => /[0-9]/.test(value) },
  { code: "PASSWORD_NO_SPECIAL_CHAR", label: "One special character", test: (value: string) => /[^A-Za-z0-9\s]/.test(value) },
] as const;
export function passwordErrorCodes(value: string): AuthErrorCode[] {
  return passwordRules.filter(rule => !rule.test(value)).map(rule => rule.code);
}
export function passwordError(value: string) {
  const code = passwordErrorCodes(value)[0];
  return code ? authErrorMessages[code] : undefined;
}
export function emailErrorCode(value: string): AuthErrorCode | undefined {
  return !value.trim() ? "EMAIL_REQUIRED" : !isValidEmail(value) ? "EMAIL_INVALID" : undefined;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = Record<string, string>;

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

export function firstInvalidField(errors: FieldErrors) {
  return Object.keys(errors)[0];
}

export function validateLoginForm(form: HTMLFormElement): FieldErrors {
  const data = new FormData(form);
  const errors: FieldErrors = {};
  const email = String(data.get("email") ?? "").trim();
  const password = String(data.get("password") ?? "");
  if (!email) errors.email = "Enter your email address.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter your password.";
  return errors;
}

export function validateSignupForm(form: HTMLFormElement): FieldErrors {
  const data = new FormData(form);
  const errors: FieldErrors = {};
  const fullName = String(data.get("fullName") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const password = String(data.get("password") ?? "");
  const confirmPassword = String(data.get("confirmPassword") ?? "");
  if (!fullName) errors.fullName = "Enter your full name.";
  const emailCode = emailErrorCode(email);
  if (emailCode) errors.email = authErrorMessages[emailCode];
  const passwordMessage = passwordError(password);
  if (passwordMessage) errors.password = passwordMessage;
  if (!confirmPassword) errors.confirmPassword = "Confirm your password.";
  else if (confirmPassword !== password) errors.confirmPassword = authErrorMessages.PASSWORD_MISMATCH;
  if (!data.has("terms")) errors.terms = "Agree to the terms to create an account.";
  return errors;
}
