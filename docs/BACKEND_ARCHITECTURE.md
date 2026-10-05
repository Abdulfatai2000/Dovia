# Backend Architecture

> Dovia backend architecture overview for Phase 0/1. This document is intentionally lightweight; full contract details remain in `docs/BACKEND.md`.

## Architecture layers

Frontend
↓
API / Server Actions
↓
Services
↓
Repositories / Models
↓
MongoDB Atlas

## Module map

| Path | Responsibility |
| --- | --- |
| `src/lib/env.server.ts` | Server-only Zod env validation for `MONGODB_URI` and `MONGODB_DB_NAME`. Never exposes secrets. |
| `src/lib/db/mongoose.ts` | Cached `connectToDatabase()` helper. Persists connection on `globalThis` to survive Next.js hot reload. |
| `src/server/constants.ts` | Shared enums, statuses, and OTP policy constants. |
| `src/server/models/` | Mongoose schemas, indexes, instance/static methods. All models use the safe registration pattern `mongoose.models.X || mongoose.model(...)`. |
| `src/server/types.ts` | Shared server-side types (file metadata, etc.). |
| `src/app/api/health/db/route.ts` | Minimal connectivity check. Returns `{ status, database }` or 503. Never returns credentials. |

## Database rules

- `MONGODB_URI` and `MONGODB_DB_NAME` are never prefixed with `NEXT_PUBLIC_`.
- Connection helper never logs the URI, username, password, or host.
- Models mark sensitive fields `select: false`: `passwordHash`, `passwordSalt`, `otpHash`.
- Serializers strip sensitive fields in `toJSON`/`toObject`.
- All business-domain documents include `workspaceId`.
- ObjectIds are used consistently for references.

## OTP rules

| Rule | Value |
| --- | --- |
| Length | 6 digits |
| Expiry | 2 minutes |
| Resend cooldown | 60 seconds |
| Maximum attempts | 5 |
| Storage | Hashed (`sha256`) with per-record salt; never plaintext |
| Invalidation | New OTP request replaces old OTP for the same email/purpose |
| TTL | `expiresAt` has `expireAfterSeconds: 0` |
| App-level check | Application must still verify expiry because TTL is not exact |

## Model summary

| Model | Collection | Notes |
| --- | --- | --- |
| User | `users` | `emailNormalized` unique, password scrypt-hashed, status enum |
| EmailVerification | `email_verifications` | TTL index on `expiresAt`, unique per email+purpose window |
| Workspace | `workspaces` | `slug` unique |
| Membership | `memberships` | Compound unique `{workspaceId, userId}` |
| Team | `teams` | References workspace and users |
| Meeting | `meetings` | Embedded agenda items |
| MeetingContent | `meeting_contents` | File metadata only, no binary storage |
| MeetingAnalysis | `meeting_analyses` | Draft AI output only; human confirmation publishes durable records |
| Decision | `decisions` | Human-confirmed decisions |
| Task | `tasks` | Derived `OVERDUE` from `dueDate` + `status`; not stored |
| Notification | `notifications` | Workspace and user scoped |
| Activity | `activities` | Workspace and entity scoped |

## Frontend migration status

Existing frontend uses demo/localStorage services (`src/services/*`, `src/lib/demo-store.ts`). No frontend routes or components import Mongoose models. Backend API migration is deferred to later phases.
