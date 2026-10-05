export const authErrorMessages = {
  PASSWORD_TOO_SHORT: "Password must contain at least 8 characters.",
  PASSWORD_NO_UPPERCASE: "Add at least one uppercase letter.",
  PASSWORD_NO_LOWERCASE: "Add at least one lowercase letter.",
  PASSWORD_NO_NUMBER: "Add at least one number.",
  PASSWORD_NO_SPECIAL_CHAR: "Add at least one special character.",
  PASSWORD_MISMATCH: "Passwords do not match.",
  EMAIL_REQUIRED: "Enter your email address.",
  EMAIL_INVALID: "Enter a valid email address.",
  VERIFICATION_CODE_REQUIRED: "Enter the 6-digit verification code.",
  VERIFICATION_CODE_INVALID: "The verification code is incorrect.",
  VERIFICATION_CODE_EXPIRED: "This verification code has expired. Request a new code.",
  VERIFICATION_ATTEMPTS_EXCEEDED: "Too many incorrect attempts. Request a new verification code.",
  VERIFICATION_REQUEST_MISSING: "No email verification request was found.",
  VERIFICATION_RESEND_COOLDOWN: "Wait until the resend countdown finishes before requesting a new code.",
} as const;
export type AuthErrorCode = keyof typeof authErrorMessages;
export class AuthValidationError extends Error {
  constructor(public readonly code: AuthErrorCode) { super(authErrorMessages[code]); }
}
