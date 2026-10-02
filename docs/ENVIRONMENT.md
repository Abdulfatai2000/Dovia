# Dovia Environment Variables

This document defines the environment-variable policy for Dovia.

## 1. Files

### `.env.example`

A safe template committed to Git. It contains variable names but no private values.

### `.env.local`

Your real local development values. This file must not be committed.

Recommended `.gitignore` rules:

```gitignore
.env*
!.env.example
```

## 2. Public versus server-only variables

Any variable beginning with `NEXT_PUBLIC_` is available in browser code.

Safe examples:

```env
NEXT_PUBLIC_APP_NAME=Dovia
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
```

Never expose secrets as public variables.

Wrong:

```env
NEXT_PUBLIC_GROQ_API_KEY=...
NEXT_PUBLIC_MONGODB_URI=...
```

Correct:

```env
GROQ_API_KEY=...
MONGODB_URI=...
```

## 3. Master `.env.local` template

```env
# Application
NEXT_PUBLIC_APP_NAME=Dovia
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
APP_URL=http://localhost:3000

# MongoDB
MONGODB_URI=
MONGODB_DB_NAME=dovia

# Auth.js
AUTH_SECRET=

# Groq
GROQ_API_KEY=
GROQ_MODEL=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Microsoft
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=

# Slack
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_SIGNING_SECRET=

# Email
RESEND_API_KEY=
EMAIL_FROM_NAME=Dovia
EMAIL_FROM_ADDRESS=

# Storage
STORAGE_PROVIDER=
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

# Background jobs / cron
CRON_SECRET=

# Application encryption
ENCRYPTION_KEY=

# Webhook verification
GOOGLE_WEBHOOK_SECRET=
MICROSOFT_WEBHOOK_SECRET=
SLACK_WEBHOOK_SECRET=

# Feature flags
NEXT_PUBLIC_ENABLE_AI=false
NEXT_PUBLIC_ENABLE_GOOGLE_INTEGRATION=false
NEXT_PUBLIC_ENABLE_MICROSOFT_INTEGRATION=false
NEXT_PUBLIC_ENABLE_SLACK_INTEGRATION=false
```

## 4. Frontend-first rule

During frontend development, only the public app variables need real values.

Backend secrets should remain blank until their implementation phase.

## 5. Secret-handling rules

- Never paste secrets into source files.
- Never put real credentials in `.env.example`.
- Never log secrets.
- Never return secrets from API responses.
- Keep Groq and MongoDB credentials server-side.
- Rotate any secret accidentally pushed to Git.
