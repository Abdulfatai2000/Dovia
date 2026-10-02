# Dovia routes

Route groups organize layouts and do not appear in URLs. Bracketed segments are dynamic parameters; the Auth.js placeholder uses a catch-all segment.

## Frontend routes

| URL | Page file |
| --- | --- |
| / | src/app/(marketing)/page.tsx |
| /features | src/app/(marketing)/features/page.tsx |
| /pricing | src/app/(marketing)/pricing/page.tsx |
| /about | src/app/(marketing)/about/page.tsx |
| /login | src/app/(auth)/login/page.tsx |
| /signup | src/app/(auth)/signup/page.tsx |
| /forgot-password | src/app/(auth)/forgot-password/page.tsx |
| /reset-password | src/app/(auth)/reset-password/page.tsx |
| /dashboard | src/app/(workspace)/dashboard/page.tsx |
| /meetings | src/app/(workspace)/meetings/page.tsx |
| /meetings/new | src/app/(workspace)/meetings/new/page.tsx |
| /tasks | src/app/(workspace)/tasks/page.tsx |
| /calendar | src/app/(workspace)/calendar/page.tsx |
| /team | src/app/(workspace)/team/page.tsx |
| /reports | src/app/(workspace)/reports/page.tsx |
| /notifications | src/app/(workspace)/notifications/page.tsx |
| /settings | src/app/(workspace)/settings/page.tsx |
| /settings/account | src/app/(workspace)/settings/account/page.tsx |
| /settings/notifications | src/app/(workspace)/settings/notifications/page.tsx |
| /settings/integrations | src/app/(workspace)/settings/integrations/page.tsx |
| /settings/security | src/app/(workspace)/settings/security/page.tsx |
| /settings/workspace | src/app/(workspace)/settings/workspace/page.tsx |
| /meetings/[meetingId] | src/app/(workspace)/meetings/[meetingId]/page.tsx |
| /meetings/[meetingId]/content | src/app/(workspace)/meetings/[meetingId]/content/page.tsx |
| /meetings/[meetingId]/ai-review | src/app/(workspace)/meetings/[meetingId]/ai-review/page.tsx |
| /meetings/[meetingId]/follow-up | src/app/(workspace)/meetings/[meetingId]/follow-up/page.tsx |
| /meetings/[meetingId]/transcript | src/app/(workspace)/meetings/[meetingId]/transcript/page.tsx |
| /meetings/[meetingId]/files | src/app/(workspace)/meetings/[meetingId]/files/page.tsx |
| /tasks/[taskId] | src/app/(workspace)/tasks/[taskId]/page.tsx |
| /team/[memberId] | src/app/(workspace)/team/[memberId]/page.tsx |

## API routes

All methods return `{ "success": true, "message": "Dovia API placeholder" }`. They do not read or modify records or perform authentication.

| URL | Methods |
| --- | --- |
| /api/auth/[...nextauth] | GET, POST |
| /api/meetings | GET, POST |
| /api/meetings/[meetingId] | GET, PATCH, DELETE |
| /api/meetings/[meetingId]/content | POST |
| /api/meetings/[meetingId]/analyze | POST |
| /api/meetings/[meetingId]/confirm | POST |
| /api/meetings/[meetingId]/follow-up | GET |
| /api/tasks | GET, POST |
| /api/tasks/[taskId] | GET, PATCH, DELETE |
| /api/teams | GET, POST |
| /api/teams/[teamId] | GET, PATCH, DELETE |
| /api/teams/[teamId]/members | GET, POST |
| /api/notifications | GET, PATCH |
| /api/reports | GET |
| /api/ai/summarize | POST |
| /api/ai/regenerate | POST |
| /api/uploads | POST |
| /api/integrations/google | GET, POST |
| /api/integrations/microsoft | GET, POST |
| /api/integrations/slack | GET, POST |

## Main journey

`/` → `/login` → `/dashboard` → `/meetings/new` → `/meetings/[meetingId]` → `/meetings/[meetingId]/content` → `/meetings/[meetingId]/ai-review` → `/meetings/[meetingId]` → `/tasks` → `/meetings/[meetingId]/follow-up`

Supporting routes: `/meetings`, `/calendar`, `/team`, `/reports`, `/notifications`, `/settings`.
