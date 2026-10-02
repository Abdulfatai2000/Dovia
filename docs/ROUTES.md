# Dovia Route Reference

> **Status:** Phase 0 scaffold complete.  
> **Framework:** Next.js App Router + TypeScript.  
> Route groups such as `(marketing)`, `(auth)`, and `(workspace)` do not appear in browser URLs.

## 1. Main product journey

```text
/
→ /login
→ /dashboard
→ /meetings/new
→ /meetings/[meetingId]
→ /meetings/[meetingId]/content
→ /meetings/[meetingId]/ai-review
→ /meetings/[meetingId]
→ /tasks
→ /meetings/[meetingId]/follow-up
```

The central Dovia loop is:

```text
Meeting
→ Decisions
→ Action Items
→ Owners
→ Deadlines
→ Progress
→ Follow-up
→ Next Meeting
```

## 2. Frontend routes

### Marketing

| Route | Purpose |
|---|---|
| `/` | Landing page and product introduction |
| `/features` | Product features |
| `/pricing` | Pricing presentation |
| `/about` | Product/company information |

### Authentication

| Route | Purpose |
|---|---|
| `/login` | Sign in |
| `/signup` | Create account |
| `/forgot-password` | Request password reset |
| `/reset-password` | Set a new password |

### Workspace

| Route | Purpose |
|---|---|
| `/dashboard` | User overview, upcoming meetings, task priorities, activity |
| `/meetings` | All meetings |
| `/meetings/new` | Create a meeting |
| `/meetings/[meetingId]` | Dynamic meeting workspace/details |
| `/meetings/[meetingId]/content` | Add notes, transcript, or file content |
| `/meetings/[meetingId]/ai-review` | Review AI-generated meeting outcome |
| `/meetings/[meetingId]/follow-up` | Track execution after the meeting |
| `/meetings/[meetingId]/transcript` | Transcript view |
| `/meetings/[meetingId]/files` | Meeting files |
| `/tasks` | My Tasks |
| `/tasks/[taskId]` | Task detail |
| `/calendar` | Calendar view |
| `/team` | Team members and workload |
| `/team/[memberId]` | Team-member detail |
| `/reports` | Productivity and follow-up analytics |
| `/notifications` | Notification center |
| `/settings` | Settings overview |
| `/settings/account` | Account profile |
| `/settings/notifications` | Notification preferences |
| `/settings/integrations` | Connected tools |
| `/settings/security` | Password, sessions, 2FA surfaces |
| `/settings/workspace` | Workspace preferences |

## 3. Meeting route behavior

`/meetings/[meetingId]` is intentionally reused rather than creating separate "before meeting" and "after meeting" routes.

### Scheduled meeting

Show:
- meeting title, time, participants and platform
- overview
- agenda
- files
- carry-over tasks
- unresolved decisions
- start/add-content actions

### Completed meeting

Show:
- AI summary
- confirmed decisions
- confirmed action items
- open questions
- notes/files
- follow-up link and progress

## 4. API routes scaffolded in Phase 0

| Route | Methods | Future responsibility |
|---|---|---|
| `/api/auth/[...nextauth]` | GET, POST | Auth.js handlers |
| `/api/meetings` | GET, POST | List/create meetings |
| `/api/meetings/[meetingId]` | GET, PATCH, DELETE | Read/update/delete meeting |
| `/api/meetings/[meetingId]/content` | POST | Save meeting content |
| `/api/meetings/[meetingId]/analyze` | POST | Run Groq meeting analysis |
| `/api/meetings/[meetingId]/confirm` | POST | Confirm AI draft and create durable outcomes |
| `/api/meetings/[meetingId]/follow-up` | GET | Follow-up aggregate |
| `/api/tasks` | GET, POST | List/create tasks |
| `/api/tasks/[taskId]` | GET, PATCH, DELETE | Task detail/update/delete |
| `/api/teams` | GET, POST | Teams |
| `/api/teams/[teamId]` | GET, PATCH, DELETE | Team detail |
| `/api/teams/[teamId]/members` | GET, POST | Membership |
| `/api/notifications` | GET, PATCH | Notifications/read state |
| `/api/reports` | GET | Aggregated reports |
| `/api/ai/summarize` | POST | Optional generic AI summary endpoint |
| `/api/ai/regenerate` | POST | Regenerate selected AI output |
| `/api/uploads` | POST | File upload ingestion |
| `/api/integrations/google` | GET, POST | Google connection |
| `/api/integrations/microsoft` | GET, POST | Microsoft connection |
| `/api/integrations/slack` | GET, POST | Slack connection |

## 5. Route protection plan

The following routes will eventually require an authenticated user and active workspace membership:

```text
/dashboard
/meetings
/tasks
/calendar
/team
/reports
/notifications
/settings
```

Authorization must ultimately be enforced on the server. Hiding navigation links is not authorization.

## 6. Current development rule

Frontend development comes first. API route files stay as placeholders until the complete frontend experience is validated.
