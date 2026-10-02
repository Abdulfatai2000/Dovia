export const MIN_PASSWORD_LENGTH = 8;

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
  if (!email) errors.email = "Enter your work email address.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid work email address.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`;
  }
  if (!confirmPassword) errors.confirmPassword = "Confirm your password.";
  else if (confirmPassword !== password) errors.confirmPassword = "Your passwords do not match.";
  if (!data.has("terms")) errors.terms = "Agree to the terms to create an account.";
  return errors;
}
