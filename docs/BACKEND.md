DOVIA

Backend & AI Implementation Handbook

Comprehensive phased build plan for Dovia server logic, MongoDB, Groq AI and integrations

> Purpose This document is the implementation handbook for the Backend/API engineers, AI engineers, security reviewers, QA and DevOps side of Dovia. It is intentionally phased so a developer can build the product in a controlled order while keeping the same product workflow, shared API contracts and MongoDB-backed data model.


| Field | Value |
| --- | --- |
| Document | Backend & AI Implementation Handbook |
| Version | 1.0 |
| Date | 1 October 2026 |
| Product | Dovia |
| Primary stack | Next.js + TypeScript + MongoDB Atlas |
| AI provider | Groq API (server-side only) |
| Audience | Backend/API engineers, AI engineers, security reviewers, QA and DevOps |


Prepared as a build-ready execution document.

# Document Map

> Use this as the order of implementation and as the review checklist during pull requests and phase handoffs.

| # | Section |
| --- | --- |
| 1 | Backend mission and architecture |
| 2 | Backend stack and service choices |
| 3 | MongoDB data model and indexes |
| 4 | Authentication/RBAC |
| 5 | API contract |
| 6 | Groq AI pipeline |
| 7 | Files/transcript ingestion |
| 8 | Notifications/jobs/integrations |
| 9 | Phase 0 - Foundation |
| 10 | Phase 1 - Auth/workspaces |
| 11 | Phase 2 - Meetings/dashboard |
| 12 | Phase 3 - Content/AI analysis |
| 13 | Phase 4 - Review/confirmation |
| 14 | Phase 5 - Tasks/follow-up |
| 15 | Phase 6 - Calendar/team/reports/settings |
| 16 | Phase 7 - Notifications/search/integrations |
| 17 | Phase 8 - Security, observability and QA |
| 18 | Phase 9 - Deployment/release |
| 19 | API reference matrix |
| 20 | Environment variables |
| 21 | Testing strategy |
| 22 | Definition of done |
| 23 | Technical references |


# 1. Backend Mission and Architecture

> Backend mission Protect Dovia data, enforce workspace permissions, persist the meeting-to-action workflow in MongoDB, orchestrate Groq safely, create accountable tasks only after human confirmation, and expose stable APIs that the frontend can trust.


## 1.1 Logical architecture

1. Next.js frontend requests an API route/server action

1. Auth layer resolves user session and active workspace

1. Authorization checks membership + object access

1. Zod validates request payload

1. Domain service applies business rules

1. Mongoose reads/writes MongoDB Atlas

1. AI service calls Groq only from server when requested

1. Jobs/notifications run after durable writes

1. Response mapper returns a frontend DTO; raw database objects are not returned directly

## 1.2 Hard backend rules

- Every protected query is workspace-scoped.

- Never trust userId/workspaceId/role/assigneeId merely because the client sent it.

- AI output is a draft, never an authoritative database mutation.

- Groq API key and MongoDB URI remain server-only.

- Meeting confirmation must be idempotent and should use a MongoDB transaction on Atlas.

- Important mutations generate activity/audit events.

- List endpoints are paginated; reports are aggregated server-side.

# 2. Backend Stack and Service Choices

| Layer | Recommended choice | Purpose |
| --- | --- | --- |
| Runtime/API | Next.js App Router Route Handlers + server-only service modules | One TypeScript codebase with explicit API boundaries |
| Database | MongoDB Atlas | Managed document database; replica set supports transactions |
| ODM | Mongoose | Schemas, validation, indexes, hooks and TypeScript models |
| Validation | Zod | Validate API input and AI output |
| Authentication | Auth.js | Session management, credentials/OAuth providers |
| Password hashing | bcryptjs or Argon2-compatible Node library | Never store plaintext credentials |
| AI | Groq API via groq-sdk or OpenAI-compatible client | Fast LLM inference; structured JSON output |
| File storage | Cloudinary raw assets, Vercel Blob or S3-compatible storage | Private meeting attachments; store only metadata in MongoDB |
| PDF/DOCX parsing | pdf-parse (or maintained equivalent) + mammoth | Extract text from supported documents |
| Email | Resend | Invites, assignment and reminder email |
| Jobs | Inngest; Vercel Cron as simpler fallback | Retries and scheduled reminders/follow-up briefs |
| Rate limiting | Upstash Redis Ratelimit or equivalent | Protect auth, invite and AI endpoints |
| Monitoring | Sentry + structured logs | Server errors, request IDs and AI failures |
| Testing | Vitest + integration tests + Playwright with frontend | Business rules and end-to-end flow |
| Deployment | Vercel Node runtime + MongoDB Atlas | Straightforward Next.js hosting |


> MongoDB decision This implementation intentionally uses MongoDB. Strong cross-document relationships are kept explicit with ObjectId references and server-side validation; frequently read snapshots may be embedded where it improves read performance without sacrificing auditability.


# 3. MongoDB Data Model and Indexes

| Collection | Key fields | Indexes/constraints |
| --- | --- | --- |
| User | name, email, passwordHash?, image, authProviders, preferences, createdAt | Unique email |
| Workspace | name, slug, ownerId, settings, createdAt | Unique slug |
| Membership | workspaceId, userId, role, status, joinedAt | Unique {workspaceId,userId} |
| Invite | workspaceId, email, role, tokenHash, expiresAt, status | Unique active token/email policy |
| Meeting | workspaceId, title, description, organizerId, date/startAt/endAt, platform, joinUrl, status, agenda[], participants[], previousMeetingId?, recurrence? | workspace/date; participant/date; organizer/date |
| MeetingContent | workspaceId, meetingId, sourceType, rawText?, fileRef?, checksum, createdBy, createdAt | meetingId; checksum for dedupe |
| MeetingAnalysis | workspaceId, meetingId, contentId, status, provider, model, promptVersion, draft JSON, validationErrors?, createdAt | meetingId+createdAt; unique analysis request key |
| Decision | workspaceId, meetingId, text, confirmedBy, confirmedAt | meetingId |
| Task | workspaceId, meetingId, analysisId?, title, description, assigneeId?, dueDate?, priority, status, blockerReason?, createdBy, completedAt? | workspace/assignee/status/dueDate; meeting/status |
| TaskActivity | workspaceId, taskId, actorId, type, oldValue?, newValue?, comment?, createdAt | taskId+createdAt desc |
| Notification | workspaceId, userId, type, title, body, entityType, entityId, readAt?, channels, createdAt | userId/readAt/createdAt |
| AuditLog | workspaceId, actorId, action, entityType, entityId, metadata, createdAt | workspaceId+createdAt |
| Integration | workspaceId, provider, status, encryptedCredentialsRef?, scopes?, metadata | unique workspace+provider |
| JobRecord | workspaceId, type, entityId, idempotencyKey, status, attempts, lastError?, runAt | unique idempotencyKey |


## 3.1 Embed vs reference guidance

- Embed meeting agenda and participant snapshots inside Meeting because they are read with the meeting and remain reasonably bounded.

- Keep MeetingContent separate because transcripts/files can be large and may have distinct retention rules.

- Keep Task separate because tasks are queried by assignee, due date and status across many meetings.

- Keep TaskActivity separate to avoid unbounded arrays.

- Store file binary content in object storage, never in MongoDB documents.

- Store the AI draft in MeetingAnalysis; publish confirmed Decision/Task records separately.

## 3.2 Core indexes

> Meeting: { workspaceId:1, startAt:1 } Meeting: { workspaceId:1, 'participants.userId':1, startAt:1 } Task: { workspaceId:1, assigneeId:1, status:1, dueDate:1 } Task: { workspaceId:1, meetingId:1, status:1 } TaskActivity: { taskId:1, createdAt:-1 } Notification: { userId:1, readAt:1, createdAt:-1 } AuditLog: { workspaceId:1, createdAt:-1 }


# 4. Authentication and Role-Based Access Control

| Role | Server-side permission summary |
| --- | --- |
| Owner | Full workspace control, roles/integrations/settings/reports |
| Admin | Manage members, meetings and workspace settings; no ownership transfer unless explicitly allowed |
| Organizer | Create meetings, edit own/permitted meetings, review and confirm outcomes |
| Member | View permitted meetings and manage assigned tasks |
| Guest | Only explicitly shared/invited meeting access |


## 4.1 Authentication

- Use Auth.js sessions. Enable Credentials only if required; OAuth via Google/Microsoft can be added independently.

- Credentials password hash uses bcrypt/Argon2; password reset tokens are random, hashed at rest and short-lived.

- Session identifies user only. Active workspace must be resolved and verified for every workspace-scoped API.

- OAuth client secrets are server-only. Redirect URLs must be configured for local/preview/production.

## 4.2 Authorization helper pattern

> requireUser() -> session user requireWorkspaceMember(workspaceId) -> membership requireRole(membership, ['owner','admin']) requireMeetingAccess(meetingId, userId, workspaceId) requireTaskAccess(taskId, userId, workspaceId) Never query by _id alone for protected resources; combine with workspaceId or verify workspace ownership immediately after lookup.


## 4.3 Permission-sensitive operations

- Confirm meeting outcome: organizer/admin/owner.

- Invite/remove/change roles: owner/admin according to policy.

- Update task: assignee, organizer or authorized manager depending on workspace policy.

- Delete/archive workspace: owner only and confirmation required.

- Reports: role-gated if they expose team-wide data.

# 5. API Contract and Error Model

## 5.1 Response conventions

> Success: { "ok": true, "data": {...}, "requestId": "..." } Failure: { "ok": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "fieldErrors": {...} }, "requestId": "..." }


## 5.2 Common status codes

| HTTP | Meaning |
| --- | --- |
| 200/201 | Successful read/create |
| 400 | Malformed request / unsupported state |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized |
| 404 | Resource not found in authorized scope |
| 409 | Conflict / duplicate confirmation / stale state |
| 413 | File/content too large |
| 422 | Validation failed |
| 429 | Rate limited |
| 500 | Unexpected server failure |
| 502/503 | Upstream provider unavailable |


## 5.3 Idempotency

- AI analyze endpoint accepts/generated idempotency key tied to meeting content checksum.

- Confirm endpoint uses unique publication token or meeting publication state plus transaction.

- Notification/job side effects use dedupe keys so retries do not spam users.

# 6. Groq AI Pipeline

> Core AI rule Groq generates a structured draft. Dovia validates it, resolves people safely and asks a human to confirm it. AI must never directly create accountable task ownership without server validation and human confirmation.


## 6.1 Groq integration

- Use groq-sdk or an OpenAI-compatible client with base URL https://api.groq.com/openai/v1.

- Read GROQ_API_KEY only in server code.

- Read GROQ_MODEL from environment; do not hard-code a model that may later be deprecated.

- Prefer Structured Outputs / JSON Schema on a model that supports it; otherwise request JSON and validate with Zod, then retry/fail safely.

- Use low temperature for extraction-style tasks.

- Store provider, model, promptVersion, latency, token/usage metadata if available and error category for observability.

## 6.2 AI input normalization

1. Load meeting metadata, agenda, participant names and sanitized content.

1. Strip unsupported binary markup and normalize whitespace.

1. Enforce maximum content size; chunk or summarize only when needed.

1. Include explicit instruction: do not invent owners, dates or decisions.

1. Request structured fields only.

## 6.3 Required structured output

| Field | Type | Rule |
| --- | --- | --- |
| summary | string | Short factual overview |
| decisions | array<string> | Explicit/strongly evidenced decisions only |
| actionItems | array<object> | title, ownerName\|null, dueDate\|null, priority\|null, evidence\|null, confidence |
| openQuestions | array<string> | Unresolved questions |
| blockers | array<object> | text, impact\|null |
| importantNotes | array<string> | Useful non-actionable context |


## 6.4 Assignee safety

- Never accept an arbitrary user ID emitted by the model. Ask for ownerName or participant reference only.

- Resolve ownerName against normalized meeting participants/workspace members using deterministic matching.

- If ambiguous or missing, persist assigneeCandidateText and needsReview=true; leave assigneeId null.

- Due dates not clearly stated remain null unless product policy explicitly allows a suggestion - and suggestions must be labeled.

## 6.5 Example server flow

> content = await loadMeetingContent(meetingId) participants = await loadMeetingParticipants(meetingId) result = await groqAnalyze({content, meeting, participants, schema}) validated = AnalysisSchema.parse(result) resolved = resolveParticipants(validated, participants) await MeetingAnalysis.create({ status:'draft', ...resolved }) return analysisDto


## 6.6 AI failure policy

| Failure | Backend behavior |
| --- | --- |
| Invalid schema | Reject result; one bounded retry with stricter prompt/structured mode; do not save malformed draft |
| Provider timeout | Return retryable status; preserve source content |
| Rate limit | Surface 429/retry-after if available; queue when using jobs |
| Provider outage | Mark analysis failed with safe error code; no partial publication |
| Content too long | Chunk or reject with actionable limit; never silently truncate critical content |
| Unsafe/empty content | Return clear analysis error; do not fabricate meeting outcome |


# 7. Meeting Content, Files and Transcripts

- MVP supports pasted text/manual notes and optional .txt/.md/.pdf/.docx upload.

- Upload files to private object storage first, then store URL/key + metadata in MongoDB.

- Validate MIME type, extension, size and ownership.

- Extract PDF/DOCX text server-side; set extractionStatus and error detail safe for UI.

- Store a SHA-256 checksum to detect duplicate content/analysis requests.

- Do not make private meeting files publicly enumerable.

- Raw transcript retention should be configurable per workspace; deletion removes stored content and storage object according to policy.

## 7.1 Optional audio phase

Audio upload/live recording is not required for the text-first MVP. A later phase can send supported audio to a Groq speech-to-text model or another transcription provider, then feed the transcript into the same analysis pipeline. This keeps the analysis layer independent from transcription.

# 8. Notifications, Jobs and Integrations

| Event | Recipient | Default channel |
| --- | --- | --- |
| Task assigned | Assignee | In-app + email |
| Task due soon | Assignee | In-app + email |
| Task overdue | Assignee; optionally organizer | In-app + email |
| Task blocked | Organizer/manager/watchers | In-app |
| Meeting starts soon | Participants | In-app/email optional |
| Outcome published | Participants | In-app + email |
| Follow-up brief ready | Organizer | In-app |


## 8.1 Job strategy

- Inngest recommended for retryable event-driven jobs; Vercel Cron is acceptable for simple hourly/daily scans.

- Use idempotency keys for each notification/job.

- Reminder job queries indexed due dates in a narrow window; do not scan the whole collection.

- Overdue state may be derived from dueDate + status but activity/notification should be written once.

- Follow-up brief generation can be requested on demand or scheduled before linked recurring meetings.

## 8.2 Integrations

- Google/Microsoft calendar sync is optional after MVP core. Store provider tokens encrypted or through provider-managed connection storage.

- Slack/Teams integration should receive only approved summaries/tasks; no raw transcript by default.

- Webhooks must verify signatures and be replay-safe.

# Phase 0 - Backend Foundation

> Phase goal Create the server architecture, database connection, shared validation, logging and test harness.


- Create /lib/db connection helper with Mongoose connection caching for dev/serverless.

- Define base model helpers, timestamps and soft-delete policy where needed.

- Create Zod request/response schemas and shared enums.

- Create request ID middleware/helper and normalized error classes.

- Configure Vitest, test database strategy and seed fixtures.

- Add env validation at startup so missing secrets fail early on server, not during random requests.

## Acceptance criteria

- App connects to MongoDB Atlas/local test DB.

- Repeated dev hot reload does not create uncontrolled connections.

- Malformed API requests return consistent errors.

- No secret values appear in logs or responses.

# Phase 1 - Authentication, Workspaces and Membership

> Phase goal Make all later data safely workspace-scoped.


- Configure Auth.js and session callbacks.

- Implement User, Workspace, Membership and Invite models.

- Create workspace creation/join/accept-invite endpoints.

- Implement requireUser/requireWorkspaceMember/requireRole helpers.

- Hash credentials/reset/invite tokens where applicable.

- Seed demo workspace and roles.

## Acceptance criteria

- Unauthenticated access returns 401 or auth redirect as appropriate.

- Cross-workspace resource access fails even when user knows another object ID.

- Duplicate membership is prevented by unique index.

- Invite expiration and reuse are handled safely.

# Phase 2 - Meetings and Dashboard

> Phase goal Implement meeting lifecycle, agenda/participants and dashboard read models.


- Meeting model + meeting service + create/read/update/list endpoints.

- Meeting participants validation against workspace; guests stored as limited participant snapshots.

- Agenda and recurrence metadata.

- previousMeetingId with same-workspace validation.

- Dashboard aggregation endpoint for upcoming meetings, my tasks placeholder/actual tasks, overdue/completed counts and recent activity.

- Meeting list search/filter/pagination.

## Acceptance criteria

- Only authorized users can read/edit meeting.

- Dashboard counts reconcile with query results.

- Indexes support workspace/date and participant/date queries.

- Invalid previousMeetingId or foreign-workspace participant is rejected.

# Phase 3 - Meeting Content and Groq Analysis

> Phase goal Persist source content and create validated Groq-backed draft analyses.


- MeetingContent model and endpoint for text/file metadata.

- Private file upload integration and text extraction workers/functions.

- Content size/type limits and checksum dedupe.

- Groq client wrapper with timeout, model env var and structured output schema.

- Analysis service with status: queued/processing/draft/failed.

- Participant resolution and needsReview fields.

- Rate limiting on analyze endpoint.

- Store promptVersion/provider/model/error metadata.

## Acceptance criteria

- Groq key never reaches browser.

- Malformed model output cannot corrupt MongoDB.

- Retry does not create uncontrolled duplicate analyses.

- Assignee IDs are resolved only from authorized meeting/workspace members.

- Failure states are queryable by frontend.

# Phase 4 - AI Review Persistence and Outcome Confirmation

> Phase goal Support editing the draft and transactionally publishing decisions/tasks.


- PATCH analysis endpoint validates organizer edits.

- MeetingAnalysis keeps draft revisions or at minimum updatedAt/updatedBy.

- Confirm service verifies permission and meeting state.

- Use MongoDB session.withTransaction to create Decision and Task records, mark analysis confirmed/published, update Meeting status and create audit/activity events.

- Use publication id/idempotency key or unique constraint so repeated confirm requests cannot duplicate tasks.

- Notification events are queued after successful transaction commit.

## Acceptance criteria

- No task exists as accountable work before confirmation.

- Repeated confirmation returns existing published outcome or 409 without duplicates.

- Every Decision/Task stores meetingId and workspaceId.

- Transaction failure leaves meeting in previous consistent state.

# Phase 5 - Tasks, Activity and Follow-up

> Phase goal Implement the execution layer that makes Dovia more than a meeting summarizer.


- Task list endpoint with assignee/status/due/priority/meeting filters and pagination.

- Task update service with permission rules, status transitions and blockerReason rules.

- TaskActivity record for status, owner, due date, priority and comments.

- Follow-up aggregate endpoint: totals, completed/in-progress/blocked/overdue and activity.

- Follow-up brief AI/service can summarize canonical task state; it must not overwrite tasks.

- Carry-over service returns unresolved tasks/decisions for linked next meeting.

## Acceptance criteria

- Task updates create activity and optionally notifications once.

- Overdue calculations use UTC timestamps and user/workspace timezone only for display/scheduling.

- Follow-up metrics come from canonical task records.

- Unresolved work can be attached to next meeting agenda without cloning completed items.

# Phase 6 - Calendar, Team, Reports and Settings

> Phase goal Implement server endpoints for the remaining sidebar destinations.


- Calendar endpoint returns meetings + task deadlines in requested date range.

- Team endpoint returns member DTOs and role-aware actions; invite/change-role/remove endpoints enforce RBAC.

- Reports use MongoDB aggregation pipelines for meeting counts, task status distribution, completion/overdue rates and trends.

- Settings model or workspace/user settings fields for notifications, meeting defaults, AI/privacy and retention.

- Audit role changes and sensitive settings modifications.

## Acceptance criteria

- Date-range queries are indexed and bounded.

- Reports do not expose unauthorized member detail.

- Only owner/admin changes workspace role/config.

- User preferences persist and are scoped correctly.

# Phase 7 - Notifications, Search and External Integrations

> Phase goal Add proactive follow-up and optional connected-tool workflows.


- Notification model/read/unread endpoints.

- Resend templates for invite, assignment, due-soon and overdue email.

- Inngest/Cron schedules for reminders and recurring follow-up briefs.

- Search endpoint using MongoDB text indexes/Atlas Search when needed; always filter by workspace before returning.

- Google/Microsoft calendar connection metadata and sync only if required for project phase.

- Slack/Teams webhook/notification integration as post-core enhancement.

## Acceptance criteria

- Job retries are idempotent.

- Search cannot leak data across workspaces.

- Integration secrets/tokens are encrypted or stored in secure provider facilities.

- Unsubscribe/preferences are respected for non-essential email.

# Phase 8 - Security, Observability and QA Hardening

> Phase goal Harden all high-risk paths before production/demo release.


## Security controls

- Zod validation on every mutation.

- Object-level authorization on every resource reference.

- Rate-limit auth, invites, file upload and AI analysis.

- CSRF/session protections from Auth.js architecture; secure cookies in production.

- Input sanitization for user-rendered rich text; prefer plain text for MVP notes/comments.

- Private file URLs or signed short-lived access.

- Security headers via Next.js config/middleware.

- Audit logs for role changes, meeting publication, task reassignment, destructive actions and integration changes.

## Observability

- Request ID on errors.

- Structured log fields: requestId, userId (non-sensitive internal ID), workspaceId, route, latency, status.

- AI log fields: provider/model/promptVersion/latency/result status - never raw confidential transcript in routine logs.

- Sentry for unhandled server exceptions and performance tracing.

## Acceptance criteria

- Cross-workspace access tests exist.

- No raw stack trace or secret returned to client.

- Large/invalid uploads fail before expensive processing.

- AI/provider outage degrades without data corruption.

# Phase 9 - Backend Deployment and Release

> Phase goal Deploy Dovia services with verified secrets, indexes, seed data, jobs and rollback procedures.


- Create MongoDB Atlas production cluster, least-privilege database user and network policy.

- Set all Vercel environment variables by environment; never commit .env.

- Ensure indexes are created/managed intentionally.

- Configure OAuth redirect URLs, Resend domain, storage bucket and Inngest/Vercel Cron callbacks.

- Run production build, unit/integration/E2E smoke tests.

- Create controlled demo seed/reset script.

- Document data retention, backup and restore process.

- Monitor first production runs for AI errors, auth failures, job failures and DB latency.

## Release gate

- Full meeting-to-follow-up journey passes.

- Confirmation is idempotent.

- No cross-workspace access is possible in tests.

- Groq outage test leaves source content intact.

- Demo reset can restore predictable data.

# 19. API Reference Matrix

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| POST | /api/workspaces | Create workspace | Auth user |
| GET | /api/dashboard | Workspace dashboard read model | Member |
| GET | /api/meetings | List/search meetings | Member |
| POST | /api/meetings | Create meeting | Organizer/member policy |
| GET | /api/meetings/:id | Meeting workspace DTO | Participant/member permission |
| PATCH | /api/meetings/:id | Edit meeting | Organizer/admin |
| POST | /api/meetings/:id/content | Add meeting text/file reference | Editor |
| POST | /api/meetings/:id/analyze | Run/queue Groq analysis | Organizer/editor |
| GET | /api/meetings/:id/analysis | Get latest draft | Authorized participant |
| PATCH | /api/meetings/:id/analysis | Edit draft | Organizer |
| POST | /api/meetings/:id/confirm | Publish decisions/tasks | Organizer/admin/owner |
| GET | /api/meetings/:id/follow-up | Follow-up aggregates | Participant |
| POST | /api/meetings/:id/follow-up-brief | Generate follow-up brief | Organizer |
| GET | /api/tasks | List tasks | Member scoped |
| GET | /api/tasks/:id | Task detail | Authorized |
| PATCH | /api/tasks/:id | Update task | Assignee/authorized lead |
| POST | /api/tasks/:id/comments | Add comment/update | Authorized |
| GET | /api/calendar | Meetings/deadlines by range | Member |
| GET | /api/team | Workspace members | Member/role-aware |
| POST | /api/invites | Invite member | Admin/owner |
| PATCH | /api/members/:id | Role/status | Admin/owner |
| GET | /api/reports | Aggregated metrics | Manager/admin/owner |
| GET/PATCH | /api/settings | User/workspace settings | Role-aware |
| GET | /api/notifications | Notifications | Current user |
| PATCH | /api/notifications/:id/read | Mark read | Current user |


# 20. Environment Variables

| Variable | Purpose | Exposure |
| --- | --- | --- |
| MONGODB_URI | MongoDB Atlas connection string | Secret |
| MONGODB_DB_NAME | Database name | Server config |
| AUTH_SECRET | Auth.js signing/session secret | Secret |
| AUTH_URL / APP_URL | Canonical application URL | Server config |
| GOOGLE_CLIENT_ID | Google OAuth client ID | Server config |
| GOOGLE_CLIENT_SECRET | Google OAuth secret | Secret |
| MICROSOFT_CLIENT_ID | Microsoft OAuth client ID | Server config |
| MICROSOFT_CLIENT_SECRET | Microsoft OAuth secret | Secret |
| GROQ_API_KEY | Groq API key | Secret |
| GROQ_MODEL | Configured model with required capabilities | Server config |
| GROQ_TIMEOUT_MS | Bound AI request duration | Server config |
| CLOUDINARY_CLOUD_NAME / BLOB config | Object storage account | Server config |
| CLOUDINARY_API_KEY | Storage API key if used | Secret |
| CLOUDINARY_API_SECRET | Storage API secret if used | Secret |
| RESEND_API_KEY | Email delivery | Secret |
| EMAIL_FROM | Verified sender | Server config |
| INNGEST_EVENT_KEY | Job event key | Secret |
| INNGEST_SIGNING_KEY | Job signature key | Secret |
| UPSTASH_REDIS_REST_URL | Rate limit store | Server config |
| UPSTASH_REDIS_REST_TOKEN | Rate limit token | Secret |
| SENTRY_DSN | Server error monitoring | Secret/config depending setup |


> Environment rule Never prefix secrets with NEXT_PUBLIC_. Validate required server variables at startup and fail fast with a generic configuration error; never print secret values.


# 21. Backend Testing Strategy

| Test layer | Minimum scenarios |
| --- | --- |
| Unit | Permission helpers, Zod schemas, AI participant resolution, due/overdue calculations, status transitions |
| Model | Mongoose schema validation, unique membership/index behavior, serialization DTOs |
| Integration | Auth + workspace scoping, meeting CRUD, analysis persistence, confirmation transaction, task update/activity |
| AI contract | Mock Groq responses: valid schema, malformed schema, unknown assignee, null due date, timeout, rate limit |
| Security | IDOR/cross-workspace attempts, role escalation, file access, invite replay, rate-limit behavior |
| Jobs | Reminder dedupe, retry idempotency, overdue notification once, follow-up brief scheduling |
| E2E | Frontend + backend full Dovia loop on test/preview environment |


# 22. Backend Definition of Done

- MongoDB schemas, indexes and workspace scoping are implemented.

- Auth/RBAC prevents cross-workspace and unauthorized mutations.

- Groq integration is server-only, structured and schema-validated.

- AI output remains a draft until human confirmation.

- Confirm endpoint is transactional/idempotent and creates traceable decisions/tasks.

- Task updates create activity and correct follow-up aggregates.

- Notifications/jobs are deduplicated and preference-aware.

- File ingestion is private and validated.

- Errors/logs are observable without leaking transcript/secrets.

- Critical unit/integration/security/E2E tests pass.

- Production environment variables, indexes, seed/reset and backup plan are documented.

> Backend completion outcome The server can securely accept a meeting, process its content through Groq, preserve a human review step, publish durable decisions and tasks into MongoDB, track execution, generate follow-up data and support every Dovia page through stable permission-aware APIs.


# 23. Technical Reference Notes

> Implementation should be checked against the current official documentation when packages/models change. The following references were used to anchor this plan:

| Reference | URL |
| --- | --- |
| Groq API Reference | https://console.groq.com/docs/api-reference |
| Groq Structured Outputs | https://console.groq.com/docs/structured-outputs |
| Groq Responses API | https://console.groq.com/docs/responses-api |
| MongoDB + Next.js Integration | https://www.mongodb.com/docs/drivers/node-frameworks/next-integration/ |
| MongoDB Mongoose Integration | https://www.mongodb.com/docs/drivers/node/current/integrations/mongoose/ |
| Next.js Documentation | https://nextjs.org/docs |


# 24. Phase 0 Completion Status

## Phase 0 - Foundation

Status: **COMPLETE**

- [x] `mongoose` added to dependencies.
- [x] Server-only environment validation created at `src/lib/env.server.ts`.
- [x] Cached Mongoose connection helper at `src/lib/db/mongoose.ts`.
- [x] Core models implemented at `src/server/models/`:
  - [x] User
  - [x] EmailVerification
  - [x] Workspace
  - [x] Membership
  - [x] Team
  - [x] Meeting
  - [x] MeetingContent
  - [x] MeetingAnalysis
  - [x] Decision
  - [x] Task
  - [x] Notification
  - [x] Activity
- [x] Database health endpoint implemented at `GET /api/health/db`.
- [x] OTP model foundation implemented with 2-minute expiry, 60-second resend cooldown, 5 attempts, TTL index.
- [x] Shared backend constants/types created at `src/server/constants.ts`.
- [x] .env.example updated with `MONGODB_URI` and `MONGODB_DB_NAME=dovia`.
- [x] Verified real Atlas connection succeeded via health endpoint.

> Frontend status: unchanged. Existing demo/mock service architecture remains active. No frontend migration to MongoDB has been performed.

