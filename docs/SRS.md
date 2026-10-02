DOVIA

Software Requirements Specification & Product Workflow Blueprint

Turn conversations into action.

> Product Vision
> Dovia is an AI-assisted meeting execution platform that transforms meeting notes and transcripts into structured decisions, accountable action items, deadlines, reminders, follow-up reports, and the agenda for the next meeting. The product is designed to close the gap between discussion and execution.


| Document | SRS + UX Workflow + Technical Blueprint |
| --- | --- |
| Version | 1.0 |
| Date | 1 October 2026 |
| Product stage | MVP / Hackathon-ready foundation |
| Primary audience | Product, design, frontend, backend, AI, QA, judges and stakeholders |


Prepared as the single source of truth for building, presenting and extending Dovia.

# Document Map

This document starts with the Software Requirements Specification, then explains the visual system, technical architecture, end-to-end workflow, every product page, data model, AI processing pipeline, security model, API contract, testing plan, deployment and roadmap.

| # | Section |
| --- | --- |
| 1 | Executive Product Definition |
| 2 | Software Requirements Specification |
| 3 | Brand & UI Design System |
| 4 | Recommended Technology Stack |
| 5 | System Architecture & Data Flow |
| 6 | Roles, Permissions & Core Objects |
| 7 | End-to-End Product Workflow |
| 8 | Detailed Page-by-Page Specification |
| 9 | AI Meeting Intelligence Pipeline |
| 10 | Data Model & API Design |
| 11 | Notifications, Integrations & Automation |
| 12 | Security, Privacy & Reliability |
| 13 | Non-Functional Requirements |
| 14 | Testing & Acceptance Criteria |
| 15 | MVP Scope, Roadmap & Demo Story |


# 1. Executive Product Definition

> The problem Dovia solves
> Meetings produce valuable decisions, but follow-up is often fragmented across notebooks, chat threads, emails and memory. Tasks lose owners, deadlines are unclear, blockers surface late, and the next meeting begins by reconstructing what happened in the previous one.


## 1.1 Product statement

Dovia is a collaborative meeting-to-execution workspace. A meeting organizer creates a meeting, adds an agenda, captures or uploads notes/transcripts, lets AI extract decisions and action items, reviews the result, confirms ownership and due dates, and then tracks execution until the next meeting.

## 1.2 Core value loop

1. Create meeting

1. Prepare agenda and carry-over items

1. Capture notes or transcript

1. AI extracts structured outcomes

1. Human reviews and confirms

1. Action items become tracked tasks

1. Reminders and updates drive execution

1. Follow-up brief summarizes progress

1. Next agenda is generated from unresolved work

## 1.3 Product principles

- Human-in-the-loop: AI proposes; people confirm important decisions, ownership and deadlines.

- Execution over summarization: a summary is useful only if it produces clear next actions.

- Traceability: every task and decision links back to the meeting that created it.

- Low-friction capture: users can paste notes, upload files or add structured notes manually.

- Team visibility without surveillance: Dovia tracks work status, not personal behavior.

- Progressive complexity: the MVP works without third-party meeting integrations; integrations can be added later.

# 2. Software Requirements Specification (SRS)

## 2.1 Scope

The MVP supports team workspaces, meetings, meeting content, AI-generated meeting outcomes, decisions, action items, task tracking, reminders, calendar views, team management, productivity reports and workspace settings. Real-time audio recording and native Zoom/Teams/Meet bots are intentionally deferred.

## 2.2 Primary users

| User type | Primary need | Typical actions |
| --- | --- | --- |
| Workspace Owner | Set up and govern the workspace | Invite members, manage roles, configure integrations, view workspace reports |
| Meeting Organizer | Turn meetings into accountable outcomes | Create meetings, set agenda, add content, review AI output, confirm tasks |
| Team Member | Know exactly what to do next | View assigned tasks, update status, comment, flag blockers, complete work |
| Manager / Team Lead | See execution health | Track meeting follow-up, overdue items, blockers and team completion trends |
| Guest / External Participant | Participate with limited access | View selected meeting details or action items when invited |


## 2.3 Functional requirements

| ID | Capability | Requirement |
| --- | --- | --- |
| FR-01 | Authentication | Users can sign up/sign in, sign out, reset password and optionally use Google/Microsoft SSO. |
| FR-02 | Workspace management | Users can create/join a workspace and invite members. |
| FR-03 | Meeting creation | Organizers can create meetings with title, date/time, participants, agenda, tags and recurrence. |
| FR-04 | Carry-over context | A meeting can display unresolved tasks/decisions from a previous related meeting. |
| FR-05 | Meeting content | Users can paste notes/transcripts, write notes manually or upload supported text/PDF/DOCX files. |
| FR-06 | AI extraction | The system extracts summary, decisions, action items, owners, dates, blockers, open questions and key notes. |
| FR-07 | Review & confirmation | Organizers can edit, add, delete, reassign and confirm AI-generated outcomes before publishing. |
| FR-08 | Action tracking | Confirmed action items become tasks with owner, due date, priority, status, source meeting and activity log. |
| FR-09 | Task updates | Assignees can update status, progress note, blocker reason and completion. |
| FR-10 | Follow-up dashboard | Users can see meeting completion percentages, overdue tasks and blockers. |
| FR-11 | My Tasks | Each user has a personal task view with filters for today, upcoming, overdue, priority and meeting. |
| FR-12 | Calendar | Meetings and task deadlines are visible in calendar and agenda views. |
| FR-13 | Notifications | The system sends in-app/email reminders for assignments, due dates, overdue work and blockers. |
| FR-14 | Reports | Leads can view aggregated execution metrics for meetings and tasks. |
| FR-15 | Next-meeting brief | Dovia generates a follow-up brief and suggested next agenda from unresolved work. |
| FR-16 | Search & filters | Users can search meetings, tasks, participants and decisions. |
| FR-17 | Audit trail | Important changes retain timestamp, actor and old/new state. |
| FR-18 | Export | Users can export a confirmed meeting outcome as PDF/printable report later in MVP+. |


## 2.4 Out of scope for first MVP

- Native Zoom/Google Meet/Microsoft Teams recording bot

- Automatic live speaker diarization during calls

- Employee productivity scoring

- Payroll/HR performance management

- Complex enterprise SSO/SAML

- Offline-first mobile app

- Full project management replacement

# 3. Brand & UI Design System

## 3.1 Brand direction

Dovia should feel calm, intelligent, accountable and professional. The visual language follows a light SaaS interface with strong navy structure, indigo-violet actions, generous white space, rounded cards and status colors that make work states easy to scan.

## 3.2 Color mixture

| Token | Hex | Use |
| --- | --- | --- |
| Primary Indigo | #4F46E5 | Main CTA, selected state, links, progress emphasis |
| Action Violet | #7C3AED | AI states, generated insights, secondary emphasis |
| Deep Navy | #14213D | Sidebar, major headings, high-contrast navigation |
| Product Blue | #2563EB | Interactive information, calendar and neutral task emphasis |
| Cyan | #06B6D4 | Integrations, informational highlights, data visualization accents |
| Success Green | #16A34A | Completed, confirmed, healthy state |
| Warning Amber | #D97706 | Due soon, needs attention, medium risk |
| Danger Red | #DC2626 | Overdue, blocked, destructive action |
| Text Slate | #475569 | Secondary body text |
| Muted Slate | #64748B | Metadata, placeholders, helper text |
| Surface | #F8FAFC | Page background |
| Panel | #F1F5F9 | Subtle sections, filters, empty-state panels |
| Border | #E2E8F0 | Cards, dividers, inputs |
| Ink | #0F172A | Primary text |
| White | #FFFFFF | Cards, modals, content surfaces |


## 3.3 Recommended gradients

- Hero gradient: #EEF2FF -> #F5F3FF -> #ECFEFF

- Primary button: #4F46E5 -> #7C3AED (use sparingly)

- AI insight chip: pale violet surface with #7C3AED icon/text

- Success card: pale green surface with #16A34A status

## 3.4 Typography and spacing

| Area | Specification |
| --- | --- |
| Typeface | Inter or Geist for production; fallback: system sans-serif. |
| H1 | 40-48 px desktop, 32-36 px tablet/mobile; 700 weight. |
| H2 | 28-32 px; 700 weight. |
| Body | 14-16 px; 400-500 weight; line-height 1.5-1.65. |
| Labels | 12-13 px; 600 weight; sentence case. |
| Spacing base | 4 px system: 4, 8, 12, 16, 24, 32, 48, 64. |
| Card radius | 12-16 px. |
| Input radius | 10-12 px. |
| Shadow | Subtle elevation only; avoid heavy floating cards. |
| Grid | 12-column desktop; 8-column tablet; 4-column mobile. |


## 3.5 Component language

- Sidebar navigation with clear active state

- Top bar with workspace switcher, global search, notification bell and profile menu

- Metric cards for counts and health indicators

- Task rows with owner avatar, status, priority and due date

- AI result cards separated into Summary, Decisions, Action Items, Open Questions and Blockers

- Confirmation banners for human review

- Modal/drawer for quick task edit

- Empty states with one obvious next action

- Skeleton loaders for AI and network operations

## 3.6 Accessibility requirements

- Minimum WCAG AA contrast for text and interactive states

- Keyboard-accessible navigation and dialogs

- Visible focus rings

- Status must use text/icons in addition to color

- Form labels must be explicit; placeholders never replace labels

- ARIA live region for long-running AI analysis completion

- Responsive layout without horizontal scrolling at 320 px

# 4. Recommended Technology Stack

| Layer | Choice | Reason |
| --- | --- | --- |
| Frontend | Next.js 16 (App Router), React, TypeScript | Full-stack React framework, routing, server actions/API routes, SEO for landing pages |
| Styling | Tailwind CSS 4 + shadcn/ui + Radix primitives | Fast consistent UI, accessible components, easy design token control |
| Validation | Zod + React Hook Form | Shared schemas and dependable form validation |
| Database | PostgreSQL on Supabase or Neon | Strong relational model for users, workspaces, meetings, memberships, tasks and audit history |
| ORM | Prisma | Typed schema, migrations, relations and developer ergonomics |
| Authentication | Auth.js | Email/password or OAuth, sessions and provider flexibility |
| AI layer | Provider abstraction; Groq for fast inference initially | Avoid lock-in while supporting summary/extraction prompts and structured JSON output |
| Transcription | Groq Whisper / Deepgram later | Optional audio-to-text path after the text-first MVP |
| Storage | Supabase Storage or Cloudinary | Meeting attachments and exported files |
| Email | Resend | Invites, assignments and reminders |
| Jobs / scheduling | Inngest or Vercel Cron | Reminder jobs, overdue checks and scheduled follow-up briefs |
| Analytics | PostHog | Product usage analytics without building reporting telemetry from scratch |
| Observability | Sentry | Client/server error tracking and performance monitoring |
| Testing | Vitest + React Testing Library + Playwright | Unit, integration and end-to-end coverage |
| Deployment | Vercel + managed PostgreSQL | Simple CI/CD and scalable web deployment |


> Stack decision note
> PostgreSQL is recommended over a document database because Dovia has strong relationships: users belong to workspaces, meetings have participants, tasks have owners, recurring meetings reference previous meetings, and reports aggregate task states over time. A relational database keeps these relationships consistent and queryable.


# 5. System Architecture & Data Flow

## 5.1 Logical architecture

Browser / PWA UI

↓

Next.js application layer

↓

Auth + authorization middleware

↓

Domain services: Meetings / Tasks / Notifications / Reports

↓

AI orchestration service

↓

PostgreSQL database

↓

Object storage

↓

Email/job queue

↓

External integrations (later)

## 5.2 Core request flow

1. User authenticates and selects a workspace.

1. Frontend requests only workspace-scoped records the user is authorized to access.

1. Meeting organizer creates meeting metadata and agenda.

1. Content is stored, then sent to AI orchestration after explicit Analyze action.

1. AI returns structured JSON; server validates it against a Zod schema before persisting draft outcomes.

1. Organizer edits and confirms the draft.

1. Confirmation transaction creates tasks, decisions and audit records.

1. Background jobs generate reminders and follow-up briefs.

1. Dashboards query task/meeting aggregates rather than raw AI text.

# 6. Roles, Permissions & Core Objects

| Role | Permissions summary |
| --- | --- |
| Owner | Full workspace control; billing/integration settings; can manage all members and reports |
| Admin | Manage members, meetings and workspace settings except ownership transfer/billing |
| Organizer | Create meetings, manage participants, review/confirm outcomes, edit tasks from own meetings |
| Member | View permitted meetings, manage assigned tasks, comment and update status |
| Guest | Limited access to explicitly shared meetings/tasks; no workspace-wide browsing |


## 6.1 Core domain objects

| Object | Purpose |
| --- | --- |
| User | Identity, profile, auth provider, notification preferences |
| Workspace | Organization/team container |
| Membership | User + workspace + role |
| Meeting | Title, schedule, organizer, status, agenda, recurrence, related meeting |
| MeetingParticipant | Meeting attendee and participation role |
| MeetingContent | Notes, transcript, file references, source type |
| MeetingAnalysis | AI draft: summary, decisions, open questions, blockers, confidence metadata |
| Decision | Confirmed decision tied to source meeting |
| Task / ActionItem | Owner, deadline, priority, status, source meeting, blocker state |
| TaskActivity | Status changes, comments, reassignments, deadline changes |
| Notification | In-app/email event and read state |
| AuditEvent | Security-sensitive or business-important changes |
| Integration | Workspace provider connection metadata |


# 7. End-to-End Product Workflow

| Stage | What happens |
| --- | --- |
| Discover | Visitor lands on Dovia, sees value proposition and chooses Get Started / Sign In. |
| Authenticate | User signs in or creates an account and enters/creates a workspace. |
| Orient | Dashboard shows meetings, tasks, overdue items and the primary New Meeting action. |
| Create | Organizer defines meeting metadata, participants, agenda and optional link to a previous meeting. |
| Prepare | Workspace surfaces carry-over tasks and previous unresolved decisions. |
| Capture | During/after meeting, organizer pastes transcript/notes or uploads a supported file. |
| Analyze | AI converts unstructured meeting content into structured draft outcomes. |
| Review | Organizer corrects AI output, confirms ownership, dates, priority and decisions. |
| Publish | Confirmed action items become tasks; participants are notified. |
| Execute | Team members update task status, comments and blocker reasons. |
| Track | Meeting follow-up view shows completion %, overdue work and blockers. |
| Plan | Before next meeting, Dovia creates a follow-up brief and suggested agenda. |
| Repeat | The next meeting references previous meeting results, closing the loop. |


> North-star workflow
> Meeting -> Decisions -> Action Items -> Owners -> Deadlines -> Progress -> Follow-up -> Next Meeting. Every major feature should strengthen this loop.


# 8. Detailed Page-by-Page Specification

The following pages form the recommended MVP information architecture. The exact route names can change during implementation, but the responsibilities and transition logic should remain stable.

PAGE 01

# Landing Page

> Explain Dovia in seconds and convert visitors into sign-ins or new accounts

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Top navigation, hero, value proposition, workflow preview, feature blocks, social proof placeholder, CTA footer |
| Main CTA | Get Started Free |
| Secondary CTA | Watch Demo / See How It Works |
| Entry route | / |
| Exit routes | /signup, /login |
| Key message | Turn every meeting into accountable action. |


## Expected user experience

- Hero shows the before/after story: scattered meeting outcomes vs. structured decisions and tasks.

- A mini product preview demonstrates AI summary + action items + progress tracking.

- Feature section highlights Capture, Extract, Assign, Track and Follow Up.

- Responsive navigation collapses to a menu on small screens.

## Validation / edge cases

- Do not require authentication to understand the product.

- Avoid feature overload; prioritize the execution loop.

## Navigation logic

> Flow
> Landing -> Sign Up / Sign In -> Dashboard


PAGE 02

# Authentication Page

> Securely sign users in and route them to the correct workspace context

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Email/password form, SSO buttons, forgot password, sign-up link |
| Main CTA | Sign In |
| Route | /login |
| Success destination | /dashboard or workspace chooser |
| Error states | Invalid credentials, unverified email, provider error, rate limit |


## Expected user experience

- Users can sign in with email/password and optionally Google or Microsoft.

- After authentication, first-time users complete a minimal workspace onboarding flow.

- Persist return URL so users opening an invite/task link land at the intended destination after sign-in.

## Validation / edge cases

- Prevent account enumeration in error messages.

- Show loading state during OAuth redirect and form submission.

## Navigation logic

> Flow
> Login -> Workspace selection/onboarding -> Dashboard


PAGE 03

# Dashboard

> Give the user an immediate view of what needs attention now

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Sidebar, top bar, greeting, New Meeting button, metrics, upcoming meetings, my tasks, overdue items, recent activity |
| Route | /dashboard |
| Main CTA | New Meeting |
| Key metrics | Upcoming meetings, tasks due, overdue tasks, blocked items |


## Expected user experience

- The dashboard prioritizes urgency rather than showing every possible statistic.

- Clicking a meeting opens its workspace; clicking a task opens its detail drawer/page.

- Managers may see a compact team health card; members see primarily personal assignments.

## Validation / edge cases

- Empty state guides a new user to create a first meeting.

- All counts must be workspace-scoped and permission-aware.

## Navigation logic

> Flow
> Dashboard -> Create Meeting / Meeting Detail / My Tasks / Calendar


PAGE 04

# Create Meeting

> Collect enough context to prepare a useful meeting without making setup tedious

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Title, date/time, duration, participants, team/project tag, meeting type, agenda, recurrence, previous meeting link |
| Route | /meetings/new |
| Main CTA | Create Meeting |
| Secondary action | Save Draft |


## Expected user experience

- Participant field searches workspace members and supports external guest email.

- Agenda uses reorderable items.

- Linking a previous meeting enables carry-over context.

- On submit, validate title/date/time and organizer permission.

## Validation / edge cases

- Prevent end time before start time.

- Warn when recurrence creates conflicts but do not silently block.

## Navigation logic

> Flow
> Create Meeting -> Meeting Workspace


PAGE 05

# Meeting Workspace / Preparation

> Provide one home for the meeting before, during and after it

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Meeting header, status, participants, agenda, carry-over actions, notes/content tab, outcome tab, activity |
| Route | /meetings/[id] |
| Main CTA | Add Meeting Content |
| Meeting states | Draft, Scheduled, In Progress, Awaiting Review, Published, Closed |


## Expected user experience

- Before the meeting, show agenda and incomplete tasks from the linked previous meeting.

- During the meeting, users can update agenda notes.

- After content is added, the same workspace becomes the launch point for AI analysis.

## Validation / edge cases

- Users without edit permission see a read-only version.

- Archived/closed meetings remain searchable but cannot be casually modified.

## Navigation logic

> Flow
> Meeting Workspace -> Add Content -> AI Review -> Outcome / Follow-up


PAGE 06

# Add Meeting Content

> Turn raw notes/transcripts/files into analyzable meeting context

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Tabs: Paste Notes, Paste Transcript, Upload File, Manual Notes; content preview; privacy notice |
| Route | /meetings/[id]/content |
| Main CTA | Analyze with Dovia AI |
| Supported MVP | Plain text, transcript text, PDF/DOCX text extraction when available |


## Expected user experience

- User chooses content type and provides text or file.

- System stores the source and shows a preview before analysis.

- Analysis is explicit; simply uploading a file does not automatically send it to the AI provider.

## Validation / edge cases

- Reject unsupported/oversized files with clear guidance.

- If content is too short, ask for more context rather than returning fake structure.

## Navigation logic

> Flow
> Add Content -> AI Review


PAGE 07

# AI Meeting Review

> Convert the meeting into structured outcomes while keeping the organizer in control

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Summary, Decisions, Action Items, Open Questions, Blockers/Risks, Important Notes, regenerate controls |
| Route | /meetings/[id]/review |
| Main CTA | Confirm Meeting Outcome |
| AI state | Draft until human confirmation |


## Expected user experience

- Each extracted action item is editable: task, owner, due date, priority and notes.

- Unresolved owner/date fields are clearly marked for manual completion.

- Decisions can be edited or removed.

- Users can add missing items manually.

## Validation / edge cases

- Never silently assign a person when the transcript is ambiguous.

- Show “Needs review” badges for low-confidence fields.

## Navigation logic

> Flow
> AI Review -> Confirm -> Meeting Outcome


PAGE 08

# Action Items / Meeting Outcome

> Show the confirmed execution plan produced by the meeting

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Confirmed decisions, task table/board, owners, due dates, priorities, source links, blockers |
| Route | /meetings/[id]/outcome |
| Main CTA | Share / Notify Team |
| Secondary | Add Task, Export summary |


## Expected user experience

- Confirmation creates durable task records linked to the meeting.

- Changing task ownership or due date after publication creates an activity/audit entry.

- Participants can filter by assignee and status.

## Validation / edge cases

- A task must always retain its source meeting even if moved between status views.

- Deleted tasks should be soft-deleted or auditable when already published.

## Navigation logic

> Flow
> Meeting Outcome -> Task Detail / Follow-up


PAGE 09

# Meeting Follow-up Detail

> Track whether the promises made in one meeting are actually being completed

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Completion progress, task status breakdown, overdue/blocked callouts, decisions, activity timeline, next-meeting brief |
| Route | /meetings/[id]/follow-up |
| Main CTA | Generate Follow-up Brief |
| Key metric | Completed / total actionable tasks |


## Expected user experience

- Progress updates automatically from task state.

- Blocked and overdue items surface above completed work.

- Organizer can request a follow-up brief at any time.

- When a next meeting exists, unresolved items can be pushed into its agenda.

## Validation / edge cases

- Do not treat completed tasks after the deadline as “on time.”

- Avoid employee leaderboard behavior.

## Navigation logic

> Flow
> Follow-up -> Next Meeting / My Tasks


PAGE 10

# My Tasks

> Give each user one dependable place to see and complete all meeting-generated work

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Tabs/filters: Today, Upcoming, Overdue, Completed; search; status; priority; meeting source |
| Route | /tasks |
| Main CTA | Update Task |
| Task states | Not Started, In Progress, Blocked, Completed, Cancelled |


## Expected user experience

- Task row shows title, source meeting, due date, priority and owner.

- Task detail supports status updates, progress note, comment and blocker reason.

- Users can group by meeting or deadline.

## Validation / edge cases

- Only authorized users can reassign tasks.

- Completed tasks remain visible in history and reports.

## Navigation logic

> Flow
> My Tasks -> Task Detail -> Source Meeting


PAGE 11

# Calendar

> Unify meeting schedules and action-item deadlines on one time-based view

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Month/week/agenda switcher, meeting events, deadline markers, filters, quick create |
| Route | /calendar |
| Main CTA | New Meeting |
| Optional integration | Google/Microsoft calendar sync later |


## Expected user experience

- Meetings and task due dates use distinct icons/status labels.

- Selecting an event opens a detail drawer.

- Filters allow My Meetings, Team Meetings and My Deadlines.

## Validation / edge cases

- Timezone is stored and displayed explicitly.

- Recurring meeting edits support “this event” vs “series.”

## Navigation logic

> Flow
> Calendar -> Meeting Detail / Task Detail


PAGE 12

# Team

> Manage the people who participate in meetings and own action items

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Member list, role, email, invite status, workload snapshot, invite button |
| Route | /team |
| Main CTA | Invite Member |
| Access | Owner/Admin primarily; members can view permitted directory |


## Expected user experience

- Invites use email and workspace-scoped token.

- Role changes are logged.

- A simple workload indicator may show open task counts, not personal productivity scores.

## Validation / edge cases

- Prevent removing the last workspace owner.

- Deactivated users cannot be assigned new tasks but historical ownership remains.

## Navigation logic

> Flow
> Team -> Member context / Invite flow


PAGE 13

# Reports & Insights

> Help teams understand meeting execution patterns without turning the product into surveillance

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Date range, meetings held, action items created/completed, overdue rate, blocker count, follow-up trend, meeting breakdown |
| Route | /reports |
| Main CTA | Export Report |
| Audience | Owner/Admin/Manager based on permission |


## Expected user experience

- Metrics aggregate execution outcomes, not keystrokes or time spent online.

- Users can filter by team/project/date.

- Each chart/metric links back to underlying meetings/tasks where authorized.

## Validation / edge cases

- Label data window and sample size.

- Do not rank employees by “productivity.”

## Navigation logic

> Flow
> Reports -> Filtered meeting/task detail


PAGE 14

# Settings

> Configure workspace identity, preferences, notifications, integrations and security

## Page contract

| Area | Specification |
| --- | --- |
| Primary UI | Workspace profile, members/roles shortcut, notification defaults, AI/privacy settings, integrations, data retention, danger zone |
| Route | /settings |
| Main CTA | Save Changes |
| Danger actions | Leave workspace, archive workspace, delete workspace - permission gated |


## Expected user experience

- Workspace name/logo/timezone can be changed by authorized roles.

- Notification preferences define email/in-app events.

- AI settings explain what content may be sent to the model provider.

- Integrations show connection status and permissions.

## Validation / edge cases

- Destructive actions require re-authentication and explicit confirmation.

- Settings changes generate audit events where relevant.

## Navigation logic

> Flow
> Settings -> Workspace configuration / Integrations / Team


# 9. AI Meeting Intelligence Pipeline

## 9.1 Input types

- Typed meeting notes

- Pasted transcript

- Uploaded textual document

- Future: audio recording/transcription

- Future: provider transcript from Zoom/Teams/Google Meet

## 9.2 Structured output schema

| Field | Example | Rule |
| --- | --- | --- |
| summary | Team agreed to keep launch date and finalize payments this week. | Short factual overview; no invented details |
| decisions[] | Use Paystack for payments. | Only explicit or strongly evidenced decisions |
| actionItems[].title | Complete payment integration | Actionable verb phrase |
| actionItems[].owner | David | Null/needs review if ambiguous |
| actionItems[].dueDate | 2026-10-09 | Null/needs review if not stated/inferred safely |
| actionItems[].priority | high | Can be suggested, but editable |
| openQuestions[] | Who owns final QA? | Unresolved questions only |
| blockers[] | Production API credentials missing | Include impact/context when available |
| importantNotes[] | Client wants mobile-first demo. | Relevant non-actionable context |


## 9.3 AI processing stages

1. Normalize and chunk long content while preserving speaker/context boundaries.

1. Run extraction prompt with strict JSON schema.

1. Validate model response server-side.

1. Merge chunk outputs and deduplicate repeated decisions/tasks.

1. Run consistency checks: owner in participant list, dates parseable, no task with empty title.

1. Persist as draft MeetingAnalysis.

1. Render editable review UI with “Needs review” markers.

1. Only after human confirmation create final Decision and Task records.

## 9.4 AI safety and quality rules

- Never fabricate a deadline because one seems reasonable.

- Never infer a sensitive personal attribute from discussion content.

- Never send unrelated workspace data to the model.

- Allow users to delete source content subject to retention policy.

- Store provider/model/version and analysis timestamp for reproducibility.

- Use deterministic/low-temperature extraction settings where available.

- Treat AI output as draft until confirmed.

# 10. Data Model & API Design

## 10.1 Relationship map

| Entity | Relationship | Connected entities |
| --- | --- | --- |
| Workspace | 1 -> many | Membership, Meeting, Integration, Notification settings |
| User | many <-> many Workspace | via Membership |
| Meeting | many <-> many User | via MeetingParticipant |
| Meeting | 1 -> many | MeetingContent, MeetingAnalysis, Decision, Task |
| Task | 1 -> many | TaskActivity, comments/updates |
| Meeting | 0/1 -> 0/1 previousMeeting | recurring/follow-up chain |


## 10.2 Suggested API surface

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | /api/workspaces | Create workspace |
| GET | /api/dashboard | Dashboard summary |
| POST | /api/meetings | Create meeting |
| GET | /api/meetings/:id | Get meeting |
| PATCH | /api/meetings/:id | Edit meeting |
| POST | /api/meetings/:id/content | Add notes/transcript/file reference |
| POST | /api/meetings/:id/analyze | Create AI draft |
| GET | /api/meetings/:id/analysis | Get current AI draft |
| PATCH | /api/meetings/:id/analysis | Edit draft outcomes |
| POST | /api/meetings/:id/confirm | Publish decisions and tasks transactionally |
| GET | /api/tasks | List authorized tasks |
| PATCH | /api/tasks/:id | Update task |
| POST | /api/tasks/:id/comments | Add task update/comment |
| GET | /api/calendar | Meetings + deadlines for time range |
| GET | /api/reports | Aggregated execution metrics |
| POST | /api/invites | Invite workspace member |


## 10.3 Transaction boundaries

- Confirm Meeting Outcome must be atomic: either decisions/tasks are all created or none are.

- Role changes and destructive workspace actions must create audit events in the same logical operation.

- Reminder jobs must be idempotent so retries do not send duplicate notifications.

# 11. Notifications, Integrations & Automation

## 11.1 MVP notification events

| Event | Recipient | Default channel |
| --- | --- | --- |
| Assigned a task | Assignee | In-app + email |
| Task due tomorrow | Assignee | In-app + email |
| Task overdue | Assignee; optional organizer | In-app + email |
| Task marked blocked | Organizer/manager + watchers | In-app |
| Meeting starts soon | Participants | In-app/email optional |
| Meeting outcome published | Participants | In-app + email |
| Follow-up brief ready | Organizer | In-app |


## 11.2 Integration roadmap

- Google Calendar / Microsoft Outlook Calendar - create/sync meeting schedule

- Slack / Microsoft Teams - publish action items and reminders

- Zoom / Google Meet / Teams - import transcripts after meetings

- Google Drive / OneDrive - attach referenced documents

- Webhooks - notify external workflow tools when tasks are created/completed

# 12. Security, Privacy & Reliability

## 12.1 Security controls

| Area | Requirement |
| --- | --- |
| Authentication | Secure sessions, OAuth state/PKCE where applicable, password hashing for credentials provider |
| Authorization | Every server query scoped by workspace membership and role; object-level checks on meeting/task access |
| Input validation | Zod schemas for every mutation; file type/size validation |
| Rate limiting | Auth, invite and AI analysis endpoints rate-limited |
| Data protection | TLS in transit; managed database encryption at rest |
| Secrets | Environment variables/secret manager; never expose provider keys to browser |
| Uploads | Signed URLs, malware scanning where feasible, private-by-default storage |
| Audit | Record role changes, meeting publication, task reassignment, destructive actions and integration changes |
| AI privacy | Explicit disclosure before model processing; send only required meeting content; provider settings reviewed for retention |
| Backups | Managed DB backups and restore procedure |


## 12.2 Privacy model

- Meeting content is workspace-confidential by default.

- Guests see only explicitly shared resources.

- Analytics use aggregate product events, not raw meeting text.

- Users can configure notification and data retention preferences where product tier allows.

- Exports must respect access permissions at generation time.

# 13. Non-Functional Requirements

| Quality | Target |
| --- | --- |
| Performance | Dashboard interactive within ~2.5s on typical broadband; common task updates feel instant with optimistic UI where safe. |
| Availability | Target 99.5%+ for MVP hosted services, excluding upstream AI provider outages. |
| Scalability | Stateless app layer; paginated meetings/tasks; background processing for AI and notifications. |
| Responsiveness | Usable from 320 px mobile through large desktop; core task update flow must work on mobile. |
| Accessibility | WCAG AA-oriented component behavior and contrast. |
| Reliability | Idempotent background jobs; transactional confirmation; retry AI call failures with user-visible state. |
| Maintainability | Typed codebase, modular domain services, migrations, documented environment variables. |
| Observability | Structured server logs, error monitoring, AI request failure metrics and job health. |
| Security | Least privilege, server-side authorization, audit trails and secure secret handling. |
| Data integrity | No orphan tasks/meetings; foreign keys and constrained enums where appropriate. |


# 14. Testing & Acceptance Criteria

## 14.1 Critical end-to-end acceptance test

1. Create account and workspace.

1. Create a meeting with two participants and agenda items.

1. Add transcript text.

1. Run AI analysis and receive structured summary/decisions/tasks.

1. Edit an incorrect task owner and add a due date.

1. Confirm meeting outcome.

1. Verify tasks appear in My Tasks for the assignee.

1. Update one task to In Progress and one to Blocked.

1. Verify meeting follow-up progress and blocker count update.

1. Mark tasks complete and generate follow-up brief.

1. Create next meeting and verify unresolved work can be included in agenda.

## 14.2 Test layers

- Unit tests: date logic, permissions, status transitions, AI schema validation.

- Component tests: forms, task rows, filters, review editor.

- Integration tests: database transactions, auth guards, AI draft persistence, notification jobs.

- End-to-end tests: complete meeting-to-follow-up workflow.

- Security tests: IDOR/workspace access, invite token handling, upload validation, rate limiting.

- Responsive/accessibility checks: keyboard, focus, contrast, screen sizes.

## 14.3 Definition of Done for each page

- Happy path implemented and tested.

- Loading, empty, error and permission-denied states designed.

- Responsive at mobile/tablet/desktop.

- Keyboard and focus behavior verified.

- Server-side authorization enforced.

- Analytics/error monitoring hooks added where appropriate.

- No unresolved console errors or type errors.

# 15. MVP Scope, Roadmap & Demo Story

## 15.1 Build phases

| Phase | Scope |
| --- | --- |
| Phase 1 - Foundation | Auth, workspace, sidebar/layout, design tokens, database schema |
| Phase 2 - Meetings | Dashboard, create meeting, meeting workspace, agenda and participants |
| Phase 3 - AI Outcomes | Content input, AI extraction, review editor, confirmation transaction |
| Phase 4 - Execution | My Tasks, task detail, status updates, blockers, meeting follow-up |
| Phase 5 - Team workflow | Notifications, calendar, team page, recurring meeting carry-over |
| Phase 6 - Insight & polish | Reports, settings, audit events, exports, accessibility, QA |
| Phase 7 - Integrations | Calendar providers, Slack/Teams, transcript import, webhooks |


## 15.2 MVP must-have vs later

| Must-have MVP | Later / enhancement |
| --- | --- |
| Email/OAuth authentication | Enterprise SSO/SAML |
| Workspace + membership | Multi-workspace enterprise admin |
| Create meeting + agenda | Live meeting bot |
| Paste/upload meeting text | Real-time transcription |
| AI structured review | Advanced multi-model routing |
| Confirmed decisions + action items | Cross-project dependency graph |
| My Tasks + status/blockers | Native mobile apps |
| Follow-up progress + brief | Deep Slack/Teams automation |
| Calendar page | Two-way external calendar editing |
| Basic reports | Advanced BI dashboards |


## 15.3 Three-minute demo narrative

- 0:00-0:25 - Problem: meetings end, but decisions and responsibilities disappear into notes and chat threads.

- 0:25-0:45 - Dashboard: show upcoming meeting, overdue item and New Meeting.

- 0:45-1:10 - Create/open meeting and show agenda plus carry-over tasks.

- 1:10-1:35 - Paste transcript and run Dovia AI.

- 1:35-2:00 - Review extracted decisions/action items; correct one owner and deadline; confirm.

- 2:00-2:25 - Open My Tasks and update a task to Blocked/Completed.

- 2:25-2:45 - Show follow-up page automatically reflecting progress and blockers.

- 2:45-3:00 - Generate next-meeting brief and close with: Dovia turns conversation into accountable action.

# Final Product Summary

> Dovia in one sentence
> Dovia is an AI-assisted meeting execution system that captures what was agreed, turns it into owned work, tracks whether it gets done, and carries unresolved work into the next meeting.


## What makes the product coherent

- One continuous loop rather than separate note-taking and task apps.

- Human confirmation before AI output becomes accountable work.

- Traceability from every task back to its source meeting.

- Follow-up and next-meeting preparation are first-class product features.

- A visual system that makes urgency, ownership and progress easy to scan.

- A relational, secure architecture ready to grow into integrations later.

DOVIA - Turn conversations into action.
