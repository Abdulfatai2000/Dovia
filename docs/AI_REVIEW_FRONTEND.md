# Master Phase 1 — AI Review and completed meetings

Workflow: Meeting Content → Mock AI Draft → Human Review → Confirmation → Completed Meeting.

Groq is NOT connected yet. The draft is a typed illustrative fixture, not an interpretation of pasted notes or uploaded metadata. Regenerate only displays an informational notice and preserves edits.

## Review and confirmation

The existing AI Review route provides Summary, Decisions, Action Items, Open Questions, Risks, and Notes tabs. Lists support addition/removal and editing. Action items expose editable title, reviewed owner, deadline, priority, and status; risks include severity. Suggested owner names never become trusted user IDs automatically: the reviewer must explicitly choose a workspace member.

Confirmation validates the summary, non-empty list entries, action titles, owners, dates, priorities, and statuses, then opens the shared accessible dialog. Edits remain in component state until confirmation, so navigating away discards unconfirmed edits. Storage failures leave edits available and display an error.

The outcome service writes one record per meeting to `dovia_demo_meeting_outcomes`. That record is the source for the completed status, confirmed outcome, and derived demo tasks. Reconfirmation replaces the record instead of appending tasks. Task IDs combine the meeting ID and stable action-item ID. Removed items disappear from the derived task source. `task.service.ts:getTasks()` exposes seed tasks plus confirmed demo tasks for later task pages; no backend task creation occurs.

The existing meeting service overlays COMPLETED status from the outcome store, preserving the seed and browser-created meeting data. A same-tab event refreshes meeting consumers. A small completed seed record supports the existing completed meeting example.

## Completed meeting

The existing meeting route switches to a completed record for COMPLETED meetings. It displays the reviewed summary, decisions, action items with owners/dates/priority/status, notes, questions, risks, participants, organizer, and file references. Share is explicitly informational. More Actions links back to review for edits or to the existing follow-up placeholder. Scheduled meetings retain their preparation workspace.

## Scope and implementation

Key files: `src/components/ai/meeting-review.tsx`, `review-list-editor.tsx`, `action-item-editor.tsx`; `src/components/meetings/completed-meeting.tsx`; `src/data/mock/meeting-analysis.ts`; `src/services/meeting-outcome.service.ts`; `src/hooks/use-meeting-analysis.ts`; and the existing meeting/task service boundaries and shared AI types.

Layouts reuse Dovia cards, tabs, labeled inputs, badges, scrollable tables, focus styles, modal, and toasts. Tables remain horizontally scrollable rather than expanding the page. Each workspace page relies on the shell for its main landmark.

No database, auth, API calls, file uploads, email, or real AI processing was added. Full tasks, follow-up, calendar, team, reports, notifications, and settings remain outside this phase.

Validation follows AGENTS.md quota-saving mode: a single lint run and build run after implementation; no browser automation, screenshots, accessibility scans, or temporary QA scripts. Visual QA is left to the user.
