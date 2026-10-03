DOVIA

Frontend Implementation Handbook

> Current implementation — Phases 4–6 (frontend-first): Dashboard, Meetings, Create Meeting, the pre-meeting workspace, and meeting content capture are implemented with typed fixtures and browser-only demo persistence. Phase 3 auth remains intact. The workflow continues to the unchanged AI Review placeholder; no backend/API or AI functionality is connected. See [MEETING_WORKFLOW_FRONTEND.md](./MEETING_WORKFLOW_FRONTEND.md). This current phase sequence supersedes the historical plan below.

Comprehensive phased build plan for every Dovia user-facing experience

> Purpose This document is the implementation handbook for the Frontend developers, UI/UX engineers, QA and product reviewers side of Dovia. It is intentionally phased so a developer can build the product in a controlled order while keeping the same product workflow, shared API contracts and MongoDB-backed data model.


| Field | Value |
| --- | --- |
| Document | Frontend Implementation Handbook |
| Version | 1.0 |
| Date | 1 October 2026 |
| Product | Dovia |
| Primary stack | Next.js + TypeScript + MongoDB Atlas |
| AI provider | Groq API (server-side only) |
| Audience | Frontend developers, UI/UX engineers, QA and product reviewers |


Prepared as a build-ready execution document.

# Document Map

> Use this as the order of implementation and as the review checklist during pull requests and phase handoffs.

| # | Section |
| --- | --- |
| 1 | Frontend mission and ownership boundary |
| 2 | Frontend stack and design system |
| 3 | Route map and page architecture |
| 4 | Shared UI/component system |
| 5 | Data access and API contract |
| 6 | Phase 0 - Foundation |
| 7 | Phase 1 - Public/Auth |
| 8 | Phase 2 - Dashboard & Meetings |
| 9 | Phase 3 - Meeting creation/preparation |
| 10 | Phase 4 - Content & AI processing UX |
| 11 | Phase 5 - AI review & confirmed outcome |
| 12 | Phase 6 - Tasks & follow-up |
| 13 | Phase 7 - Calendar/Team/Reports/Settings |
| 14 | Phase 8 - Notifications/Search/Integrations |
| 15 | Phase 9 - QA, accessibility, performance and release |
| 16 | Page-by-page implementation checklist |
| 17 | Frontend testing matrix |
| 18 | Environment variables & deployment |
| 19 | Definition of done |


# 1. Frontend Mission and Ownership Boundary

> Frontend mission Build a fast, responsive and trustworthy interface that takes a user from meeting creation to confirmed action items and then keeps the user aware of what must happen next. The frontend must make AI output reviewable rather than treating AI as an invisible authority.


## 1.1 What frontend owns

- All public and authenticated pages, responsive layouts, navigation, forms, tables, charts, drawers, modals and empty/loading/error states.

- Client-side input experience and immediate validation feedback using shared Zod schemas where practical.

- Typed consumption of backend APIs; optimistic updates only for safe mutations such as simple task status changes.

- AI processing UX: upload/paste states, progress, draft review, low-confidence warnings, edit controls, regeneration and confirmation flow.

- Accessibility, keyboard behavior, responsive design, visual consistency and usability from 320 px mobile through large desktop.

- Frontend tests and user-flow integration verification.

## 1.2 What frontend must NOT own

- No direct MongoDB connection from browser code.

- No Groq API key, MongoDB URI, Auth secret, email provider key or storage secret in NEXT_PUBLIC_* variables.

- No final authorization decisions based only on hidden controls or disabled buttons; backend must enforce access.

- No business-critical totals calculated independently when the backend already exposes canonical aggregates.

- No creation of accountable tasks directly from unconfirmed AI output.

## 1.3 Product workflow the UI must preserve

1. Visitor understands Dovia

1. User authenticates and enters a workspace

1. Dashboard shows priorities

1. Organizer creates meeting

1. Meeting workspace carries agenda and unresolved prior work

1. Notes/transcript/file are added

1. Groq-backed analysis produces a draft

1. Organizer reviews/edits/approves

1. Confirmed action items become tasks

1. Team members update work

1. Follow-up page tracks completion and blockers

1. Unfinished work feeds the next meeting

# 2. Frontend Stack and Design System

## 2.1 Required frontend stack

| Area | Choice | Why |
| --- | --- | --- |
| Framework | Next.js App Router + React + TypeScript | Routing, server components, client islands, metadata and shared full-stack types |
| Styling | Tailwind CSS 4 | Tokenized, responsive utility-first styling |
| UI primitives | shadcn/ui + Radix UI | Accessible dialogs, dropdowns, tabs, popovers and form controls |
| Forms | React Hook Form + Zod | Performant forms and shared validation |
| Icons | Lucide React | Consistent stroke icon set |
| Client data | Server Components + fetch; TanStack Query for highly interactive client state | Keep initial data server-first while supporting mutation-heavy pages |
| Charts | Recharts | Reports and follow-up visualizations |
| Calendar | FullCalendar or equivalent accessible calendar component | Month/week/day meeting and deadline views |
| Dates | date-fns + timezone helpers | Safe formatting and due-date UI |
| Toasts | Sonner | Success/error feedback |
| Testing | Vitest + React Testing Library + Playwright | Unit, interaction and end-to-end coverage |
| Monitoring | Sentry browser SDK (optional for MVP) | Capture client errors and performance |


## 2.2 Dovia color mixture

| Token | Hex | Use |
| --- | --- | --- |
| Primary Indigo | #4F46E5 | Primary CTA, active navigation, key progress |
| Action Violet | #7C3AED | AI states and secondary emphasis |
| Deep Navy | #14213D | Sidebar, headings, high-contrast navigation |
| Product Blue | #2563EB | Calendar/information states |
| Cyan | #06B6D4 | Integration and chart accents |
| Success Green | #16A34A | Completed/confirmed |
| Warning Amber | #D97706 | Due soon/attention |
| Danger Red | #DC2626 | Overdue/blocked/destructive |
| Ink | #0F172A | Primary text |
| Text Slate | #475569 | Secondary text |
| Muted Slate | #64748B | Metadata/helper text |
| Surface | #F8FAFC | Page background |
| Panel | #F1F5F9 | Subtle surfaces |
| Border | #E2E8F0 | Cards/inputs |
| White | #FFFFFF | Cards/modals |


## 2.3 Visual rules

- Use Deep Navy for the persistent sidebar and major headings; active sidebar item uses an indigo/blue highlight.

- Primary CTA uses Primary Indigo; violet is reserved for AI-generated content and intelligent suggestions.

- Status must never rely on color alone - pair each status with text and/or icon.

- Use 12-16 px card radius, 10-12 px input radius, light borders and restrained shadows.

- Default typeface: Geist or Inter; body 14-16 px; H1 40-48 px desktop and 32-36 px mobile.

- Spacing follows a 4 px scale: 4, 8, 12, 16, 24, 32, 48, 64.

## 2.4 Status token map

| State | Color | Label/icon rule |
| --- | --- | --- |
| Not Started | Slate/neutral | Text label + empty circle |
| In Progress | Blue | Text + progress/clock icon |
| Blocked | Red | Text + warning icon + blocker reason |
| Completed | Green | Text + check icon |
| Overdue | Red | Text + due date highlighted |
| AI Draft | Violet | Draft/AI badge; never look identical to confirmed data |
| Needs Review | Amber | Explicit badge on ambiguous AI fields |


# 3. Route Map and Page Architecture

| Route | Page | Access | Purpose |
| --- | --- | --- | --- |
| / | Landing | Public | Value proposition, workflow, product preview, CTA |
| /auth/sign-in | Sign In | Public | Credentials/OAuth and invite return URL |
| /auth/sign-up | Sign Up | Public | Create account and first workspace |
| /dashboard | Dashboard | Protected | Upcoming meetings, tasks, overdue work, recent activity |
| /meetings | Meetings | Protected | Search/filter all meetings |
| /meetings/new | Create Meeting | Organizer | Meeting form and preview |
| /meetings/[id] | Meeting Workspace | Participant | Agenda, participants, files, carry-over, start/add content |
| /meetings/[id]/content | Add Meeting Content | Editor | Paste/upload/manual content and analyze |
| /meetings/[id]/review | AI Meeting Review | Organizer | Review/edit summary, decisions, action items, questions, blockers |
| /meetings/[id]/outcome | Meeting Outcome | Participant | Confirmed summary/decisions/tasks |
| /meetings/[id]/follow-up | Follow-up | Participant | Progress, task status, activity and next brief |
| /tasks | My Tasks | Protected | Personal action items with filters |
| /calendar | Calendar | Protected | Meetings + deadlines |
| /team | Team | Role-aware | Members, invitations, workload snapshot |
| /reports | Reports | Manager/Admin | Execution metrics and trends |
| /settings | Settings | Protected | Account/workspace/notifications/integrations/security |


## 3.1 Layout hierarchy

- Public layout: top navigation, marketing content, minimal footer.

- Auth layout: focused single form with optional product illustration; never mix full landing content into login form.

- App layout: persistent sidebar + topbar + page content. Sidebar items: Dashboard, Meetings, My Tasks, Calendar, Team, Reports, Settings.

- Mobile app layout: sidebar becomes drawer; topbar keeps search/profile compact; primary CTA remains visible without forcing horizontal scroll.

# 4. Shared UI and Component System

| Component | Responsibilities | Used on |
| --- | --- | --- |
| AppShell | sidebar, topbar, responsive drawer | Every protected page |
| PageHeader | title, helper text, breadcrumbs, primary CTA | All app pages |
| MetricCard | icon, value, label, helper/trend | Dashboard, Calendar, Team, Reports, Follow-up |
| StatusBadge | centralized state -> icon/color/text mapping | Tasks, meetings, reports |
| PriorityBadge | Low/Medium/High/Urgent map | Task tables and AI review |
| DataTable | sorting, filtering, pagination, row actions | Tasks, members, meeting outcome |
| EmptyState | icon, message, single CTA | First-use and no-result states |
| ConfirmDialog | destructive/critical confirmation | Delete, confirm outcome, archive |
| TaskDrawer | quick view/edit status/comment/blocker | Dashboard, tasks, follow-up |
| MeetingCard | time, title, platform, participants, status | Dashboard, meetings, calendar |
| AISection | AI badge, draft status, editable content | Review page |
| Skeletons | page-specific loading structure | All data pages |
| Toast/InlineAlert | success, warning, failure | Mutations and AI calls |


## 4.1 Component reuse rules

- One Sidebar, one PageHeader pattern, one task status mapper and one confirmation dialog system.

- Do not duplicate priority/status color logic inside individual pages.

- Table columns are feature-specific, but table behavior should come from the shared DataTable primitive.

- Charts receive already-normalized DTOs; chart components should not reproduce backend business rules.

# 5. Data Access and API Contract

## 5.1 Preferred data pattern

1. Use Server Components for initial page data when no browser-only API is required.

1. Use a typed apiClient for browser mutations and interactive refetches.

1. Keep DTO types in shared /types or generated from shared Zod schemas.

1. Normalize server errors to { code, message, fieldErrors?, requestId? }.

1. Use query-string filters for list views so URLs remain shareable.

1. After mutations, update local state optimistically only when safe, otherwise wait for canonical server response.

## 5.2 Frontend-consumed endpoints

| Endpoint | Frontend use |
| --- | --- |
| GET /api/dashboard | Dashboard read model |
| GET /api/meetings | Meeting list/search |
| POST /api/meetings | Create meeting |
| GET/PATCH /api/meetings/:id | Meeting workspace/editor |
| POST /api/meetings/:id/content | Add text/file metadata |
| POST /api/meetings/:id/analyze | Start Groq analysis job/request |
| GET/PATCH /api/meetings/:id/analysis | Load/edit draft |
| POST /api/meetings/:id/confirm | Publish outcome/tasks |
| GET /api/tasks | My Tasks |
| PATCH /api/tasks/:id | Status/priority/due date/blocker update |
| POST /api/tasks/:id/comments | Comment/update |
| GET /api/calendar | Meetings + deadlines by range |
| GET /api/team | Member list |
| POST /api/invites | Invite member |
| GET /api/reports | Report DTO |
| GET/PATCH /api/settings | Preferences/workspace settings |
| GET /api/notifications | Notification center |


## 5.3 Required view states

| State | UI requirement |
| --- | --- |
| Loading | Skeleton matching page shape; do not blank the entire app shell |
| Empty | Explain why empty and show one primary next action |
| Error | Plain-language message + retry; preserve user input |
| Permission denied | Explain missing permission without leaking hidden data |
| Success | Toast/inline acknowledgement + visible updated state |
| Offline/network | Do not claim mutation succeeded; allow retry |
| AI processing | Show processing status; prevent duplicate submission; preserve source content |
| AI partial/ambiguous | Mark needs-review fields; never hide uncertainty |


# Phase 0 - Frontend Foundation

> Phase goal Establish the visual system, repository structure, app shell and shared components before feature pages are built.


## Tasks

- Configure Next.js, TypeScript strict mode, Tailwind CSS 4, shadcn/ui, Lucide, ESLint/Prettier and import aliases.

- Create public, auth and protected route groups.

- Implement Dovia design tokens and global CSS variables.

- Build AppShell, Sidebar, Topbar, mobile drawer, PageHeader, Button, Input, Select, Badge, Modal, Tabs, DataTable, MetricCard, Skeleton, EmptyState and toast system.

- Add shared types/enums for MeetingStatus, TaskStatus, Priority, Role, AIReviewState.

- Create apiClient, error normalizer and auth-aware fetch helper.

- Create Storybook only if team size warrants it; otherwise build a /dev/ui page during development.

## Acceptance criteria

- Protected shell renders consistently on desktop/tablet/mobile.

- All colors and statuses come from shared tokens.

- No browser-visible secret variables.

- Typecheck and lint pass.

- Shared components have basic accessibility labels and visible focus states.

# Phase 1 - Public Site, Authentication and Onboarding

> Phase goal Allow users to understand Dovia, sign in/sign up, accept invitations and land in the correct workspace.


## Pages

- Landing page

- Sign in

- Sign up / invite acceptance

- Minimal first-workspace onboarding

## Frontend work

- Hero: “Turn every meeting into progress” or Dovia equivalent, product preview, four core value cards, CTA.

- Auth form with email/password, Google/Microsoft buttons if backend providers are enabled, forgot-password link and return URL handling.

- Show field validation, disabled submit during request and provider redirect loading state.

- Invitation deep-link flow preserves invite token/target route across authentication.

- On first login, ask for workspace name and optionally team name only; keep onboarding short.

## Acceptance criteria

- Landing and auth are separate pages.

- Authenticated user is redirected away from auth pages.

- Failed auth never clears email field or exposes whether an account exists.

- Keyboard-only user can complete the forms.

# Phase 2 - Dashboard and Meetings Navigation

> Phase goal Give users a clear home page and a browsable list of all meetings.


## Frontend work

- Dashboard metric cards: upcoming meetings, my tasks, overdue tasks, completed tasks.

- Upcoming Meetings panel with join/open action; My Tasks panel with status/priority; Recent Activity feed.

- New Meeting CTA routes to /meetings/new.

- Meetings page with search, status/date/type filters, pagination, meeting cards/table and empty state.

- Global search UI may start as meeting/task scoped search and expand later.

## Acceptance criteria

- Counts match list contents returned by backend DTO.

- Task/meeting clicks open the correct source page.

- No user sees data from another workspace.

- Dashboard remains useful with 0 meetings and 0 tasks.

# Phase 3 - Meeting Creation and Pre-Meeting Workspace

> Phase goal Build the organizer experience from “New Meeting” to a prepared meeting workspace.


## Create Meeting form

- Fields: title, date, start/end or duration, meeting type/platform, team/project, participants, agenda, optional description, recurrence, send invitation toggle, optional previous meeting link.

- Use participant combobox with avatars and email guest option if allowed.

- Agenda supports add/remove/reorder; validate at least a title and valid future/present schedule.

- Show a live meeting preview on desktop; stack below form on mobile.

## Meeting Workspace

- Tabs: Overview, Agenda, Participants, Files.

- Show carry-over tasks/decisions from prior meeting with overdue/in-progress/needs-decision badges.

- Show participants, supporting files and Start Meeting/Add Content CTA.

- Read-only users see edit controls removed, not merely disabled.

## Acceptance criteria

- Meeting persists and refreshes correctly.

- End time before start time is blocked.

- Carry-over data is visibly separated from new agenda.

- Permissions change the available actions.

# Phase 4 - Meeting Content and AI Processing UX

> Phase goal Allow users to provide notes/transcripts/files and safely request Groq-powered meeting analysis.


## Content page

- Tabs: Paste Notes, Upload File, Type Manually; transcript can share the paste mode with a source-type selector.

- Support large text area with character count and source label.

- For file upload, show accepted types, file size, upload progress and remove/replace action.

- Show privacy notice before AI processing: content will be sent to configured AI provider for analysis.

- Analyze button sends one request and transitions to a processing state; block double submission.

## AI processing states

| State | Visual treatment | Action |
| --- | --- | --- |
| Ready | Normal CTA | Analyze with Dovia AI |
| Uploading | Progress bar | Cancel if supported |
| Queued/Processing | Violet AI card + spinner/skeleton | Allow leaving page; preserve job state |
| Succeeded | Success notice | Open AI Review |
| Failed | Inline error with request ID | Retry |
| Too little content | Guidance warning | Return to editor |
| Rate limited | Explain wait time | Retry later |


## Acceptance criteria

- Frontend never calls Groq directly.

- User cannot accidentally create duplicate analyses by double-clicking.

- Source text remains available after a failed AI request.

- Processing state survives refresh when backend exposes job/analysis status.

# Phase 5 - AI Review and Confirmed Meeting Outcome

> Phase goal Make the AI draft editable and clearly separate draft intelligence from published accountable work.


## Review page

- Tabs: Summary, Decisions, Action Items, Open Questions, Risks/Blockers, Notes.

- Action item row fields: title, assignee, deadline, priority, status draft value, notes/evidence and needs-review badge.

- Owner selector only shows meeting participants/workspace members returned by backend.

- Allow add/edit/delete decisions and action items.

- Show Regenerate button with confirmation because it may replace draft content.

- Keep “Confirm Meeting Outcome” as the dominant final action.

## Confirmation UX

- Before confirm, show unresolved owner/deadline warnings.

- If backend requires missing fields to be resolved, surface field-level errors and scroll to them.

- On success, navigate to /outcome and show “Meeting outcome published” confirmation.

- Outcome page is no longer styled as editable AI draft; it presents durable decisions and tasks.

## Acceptance criteria

- AI never appears to silently decide ownership.

- Low-confidence/ambiguous fields are obvious.

- Confirming twice from accidental navigation does not duplicate tasks because backend is idempotent.

- Outcome links every task back to its source meeting.

# Phase 6 - My Tasks and Meeting Follow-up

> Phase goal Complete the accountability loop after the meeting.


## My Tasks page

- Tabs/filters: All, Today, Upcoming, Overdue, Completed; optional priority/meeting filters.

- Table columns: task, source meeting, due date, priority, status, row actions.

- Task drawer/detail supports status, blocker reason, progress/comment, due date and source meeting link according to permissions.

- Completed rows remain discoverable; overdue label disappears once completed but history stays auditable.

## Meeting Follow-up page

- Metric cards: total tasks, completed, in progress, overdue/blocked.

- Overall progress bar and task-status donut.

- Task list from this meeting with owner/due date/priority.

- Task activity feed showing comments, status changes and deadline changes.

- Generate Follow-up Brief button; if next meeting exists, offer “Add unresolved items to next agenda”.

## Acceptance criteria

- Changing a task updates dashboard and follow-up data after canonical response/revalidation.

- Blocked tasks require visible reason when backend policy requires it.

- Progress percentage uses backend result, not duplicated client math.

- Source-meeting navigation works from every task.

# Phase 7 - Calendar, Team, Reports and Settings

> Phase goal Finish all persistent sidebar destinations and administrative views.


## Calendar

- Month/week/day or month/week/agenda views.

- Meetings use event colors; task deadlines appear as distinct markers.

- Click event opens source meeting/task.

- New Meeting CTA pre-fills selected date when launched from calendar.

## Team

- Member table: name, email, role, department/team, status, actions.

- Invite form with role selector; manager/owner actions only when authorized.

- Workload cards are based on backend aggregates and should not be framed as employee scoring.

## Reports

- Date range filter; meetings held, tasks completed, overdue count/rate, follow-up completion rate.

- Charts for meeting output/task distribution/team completion trends.

- Every chart has accessible text summary and empty state.

## Settings

- Account/profile, notification preferences, meeting defaults, integrations, security and workspace preferences tabs.

- Show integration connection status but never expose tokens.

- Danger zone requires re-auth/confirmation if backend supports it.

## Acceptance criteria

- All sidebar pages are functional and permission-aware.

- Reports use backend-calculated aggregates.

- Team/settings mutations show success and failure states.

- Calendar is usable on mobile via agenda fallback.

# Phase 8 - Notifications, Search and Integration Surfaces

> Phase goal Add cross-cutting productivity features after the core meeting-to-action loop is stable.


- Notification bell with unread badge, list, mark-as-read and deep links.

- Global search across meetings, tasks and decisions with debounced query and result grouping.

- Integration settings for Google Meet/Calendar, Microsoft, Slack/Teams as backend capabilities become available.

- “Join meeting” buttons use meeting URLs only; frontend never stores provider credentials.

- Email/in-app notification preferences live in Settings and are persisted by backend.

## Acceptance criteria

- Deep links route to authorized resources.

- Search does not expose cross-workspace data.

- Disconnected integrations degrade gracefully.

# Phase 9 - Frontend QA, Accessibility, Performance and Release

> Phase goal Make the frontend demo-ready and production-safe.


## QA checklist

- Responsive review at 320, 375, 768, 1024, 1440+ px.

- Keyboard navigation through sidebar, dialogs, forms, tabs and tables.

- Visible focus ring, explicit labels, aria-live for AI completion, reduced-motion support.

- Lighthouse/performance review: avoid shipping large calendar/chart bundles to pages that do not use them.

- Use dynamic imports for heavy chart/calendar components when useful.

- Test browser refresh on every nested route.

- Verify all empty/loading/error/permission states.

- Production build, typecheck, lint, unit tests and Playwright critical path pass.

## Critical Playwright path

1. Sign in

1. Create meeting

1. Open meeting workspace

1. Add notes

1. Request AI analysis

1. Review and edit AI action item

1. Confirm meeting outcome

1. Open My Tasks

1. Change task status

1. Open meeting follow-up and verify progress

1. Open Calendar/Reports/Settings

# 16. Page-by-Page Implementation Checklist

| Page | Must contain | Primary action |
| --- | --- | --- |
| Landing | Hero, product preview, four features, trust/CTA, responsive nav | Get Started / Sign In |
| Sign In / Sign Up | Credentials/OAuth, remember/forgot, return URL, loading/error | Dashboard or invite target |
| Dashboard | Metric cards, upcoming meetings, my tasks, activity | New Meeting |
| Meetings List | Search, filters, pagination, statuses | Open/Create meeting |
| Create Meeting | Meeting metadata, participants, agenda, recurrence, preview | Create Meeting |
| Meeting Workspace | Overview, carry-over, participants, files, agenda | Start/Add Content |
| Add Content | Paste/upload/manual content, preview, privacy notice | Analyze with Dovia AI |
| AI Review | Summary/decisions/actions/questions/blockers, edit + confidence | Confirm Meeting Outcome |
| Meeting Outcome | Published summary, decisions, task table | Share/Notify |
| Follow-up | Progress, task status, activity, brief, carry-over | Generate Brief |
| My Tasks | Personal filters/list/detail drawer | Update Task |
| Calendar | Month/week/agenda, meetings + deadlines | New Meeting |
| Team | Members, roles, invites, workload snapshot | Invite Member |
| Reports | Metrics/charts/date filters | Export later |
| Settings | Account, notifications, defaults, integrations, security | Save Changes |


# 17. Frontend Testing Matrix

| Test level | Minimum coverage |
| --- | --- |
| Unit | StatusBadge maps all statuses; form schema messages; date formatting; utility functions |
| Component | Create Meeting validation; AI action item editor; task drawer; confirmation dialogs |
| Integration | Dashboard fetch/error states; create meeting submit; AI review save; task update |
| E2E | Sign in -> create -> analyze -> confirm -> update task -> follow-up |
| Accessibility | axe checks, keyboard focus, labels, contrast, dialog focus trap |
| Visual | Desktop/tablet/mobile screenshots for all core pages |
| Failure | API 401/403/422/429/500; AI timeout; upload error; empty lists |


# 18. Frontend Environment Variables and Deployment

> Frontend code may run in the same Next.js repository as backend code, but browser-exposed variables must remain minimal. Anything prefixed NEXT_PUBLIC_ is visible to users.

| Variable | Purpose |
| --- | --- |
| NEXT_PUBLIC_APP_URL | Public canonical URL used for links/metadata |
| NEXT_PUBLIC_SENTRY_DSN | Optional browser error reporting DSN |
| NEXT_PUBLIC_POSTHOG_KEY | Optional product analytics key |
| NEXT_PUBLIC_POSTHOG_HOST | Optional analytics host |


> Secret-handling rule GROQ_API_KEY, MONGODB_URI, AUTH_SECRET, OAuth client secrets, Resend keys, storage secrets and job-system keys are server-only and must never be exposed to the browser.


## Deployment checklist

- Build on Vercel or equivalent Node-compatible Next.js host.

- Set production APP URL and auth redirect URLs.

- Run npm run build, typecheck, lint and E2E smoke tests against preview environment.

- Verify real API error states and route refresh behavior.

- Verify no secret appears in rendered HTML, source maps or client bundle environment.

# 19. Frontend Definition of Done

- Every approved Dovia page is implemented and responsive.

- All protected routes use the app shell and consistent design tokens.

- Frontend uses typed backend contracts and does not talk directly to MongoDB or Groq.

- Loading, empty, error, permission and success states are implemented.

- AI draft vs confirmed outcome is visually unambiguous.

- Core keyboard/accessibility behavior works.

- Critical meeting-to-follow-up flow passes Playwright.

- Production build passes lint/typecheck/tests and has no exposed secrets.

> Frontend completion outcome A user can start from the Dovia landing page, authenticate, create a meeting, provide meeting content, review Groq-generated structured outcomes, confirm them, manage tasks and understand follow-up progress without needing developer assistance.
