# Meeting workflow frontend — Phases 4–6

The implemented route sequence is:

Dashboard → Meetings → New Meeting → Pre-meeting Workspace → Add Content → AI Review placeholder.

## Screens and behavior

- Dashboard: four totals derived from the small demo dataset, four upcoming meeting previews, task links, and illustrative activity. Empty and skeleton variants are available on preview components.
- Meetings: local title search, status/type/team filters, Upcoming/Past/Drafts/Completed tabs, and linked meeting cards. Filters combine with the active tab. The fixed demo calendar is October 5, 2026, independent of the server clock.
- Create Meeting: labeled fields, required validation with first-error focus, selectable teammates, multiline agenda, description, platform, team, invitation/recurrence preferences, and live preview. Abdulfatai is the organizer; at least one other participant is required. Recurrence and invitations are demo preferences only.
- Meeting workspace: meeting details, agenda, participants, supporting-file references, and carry-over tasks/decisions. Start Meeting opens content capture; no live call is launched. Edit currently explains that existing-meeting editing is deferred. Completed seed records use this preparation view; confirmed-result layouts are deferred.
- Content capture: Paste Notes and Type Manually share a text draft; Upload File is a separate metadata preview. A Save demo draft action and continuation both persist through the service. Generate Meeting Summary opens the unchanged AI Review placeholder. No analysis occurs.

## Data and service boundary

Typed fixtures live in src/data/mock/{users,meetings,tasks,activities}.ts. Existing Meeting, Task, and UserProfile contracts are reused; Meeting is extended with the preparation fields. The useMeetings hook loads after hydration and responds to cross-tab storage changes.

Components access src/services/meeting.service.ts, which combines seed meetings with browser-created meetings. No placeholder API is called. Browser storage failures and malformed saved records are surfaced as errors rather than reported as successful writes.

- dovia_demo_meetings: newly created meetings, using crypto.randomUUID() only during submission.
- dovia_demo_meeting_content_[meetingId]: explicitly saved text, selected mode, and optional file metadata.

This is demo persistence, not a production store. Clearing these keys removes the demo records. No authentication, database, cloud synchronization, email, calendar integration, or task creation exists. Notes are saved only on Save demo draft or continuation; unsaved edits are component state.

## File selection

Native selection and drag/drop accept one non-empty TXT, MD, DOCX, or PDF file, up to 10 MB. Extension and supplied MIME type are checked (empty/generic browser MIME values are tolerated). File name, size, type, and Remove are shown. No file bytes are read, parsed, uploaded, or persisted. File-mode continuation stores a reference and previews the next screen; it does not make the file available for real analysis.

## Layout and accessibility

The existing WorkspaceShell supplies the sole main landmark. All controls reuse Dovia tokens and primitives. ButtonLink shares Button's style generator while retaining native link semantics. Tabs, dropdowns, and the Edit notice reuse existing keyboard interactions. Forms link error text to controls, include an error summary, and focus the first invalid field. Status and priority badges include text.

Stats stack at 375px, become two columns at 768px, and four at 1024px. Main dashboard sections use two columns from 1024px. Form and meeting details use two columns where workspace width allows (1280px+). Cards, fields, tabs, and long text remain safe on smaller screens.

## Boundary

Phase 7 AI review and human confirmation remains an existing placeholder. Auth, workspace navigation, backend placeholders, tasks, calendar, team, reports, notifications, and settings are outside this implementation.

## Verification

Browser checks covered all five implemented screens at 375, 768, 1024, and 1440px, with no horizontal page overflow. WCAG 2 A/AA and 2.1 AA automated scans reported no violations for the normal layouts and file-input layouts. Desktop dashboard and mobile form/content screenshots were visually reviewed.

The checked flow creates a meeting, verifies participant removal and recurrence preference, reloads the meeting, views agenda/participants, saves and restores a long draft, and continues to the unchanged AI Review placeholder. Additional checks covered dashboard links, list searches and filters, keyboard tabs, the Edit notice, valid/unsupported/empty/oversized files, file removal, metadata-only continuation, unknown IDs, and corrupted storage.

Tasks, Calendar, Team, Reports, Settings, and the four auth routes still rendered. No application API requests, hydration errors, or browser console errors were detected. A development-server route returned a stale 404; the full route and workflow checks passed on a fresh production build.

This is automated browser and visual review, not a full assistive-technology audit.

Final checks: npm run lint PASS; npm run build PASS. Targeted production-browser checks also passed for single/multiple-file drag/drop, meeting/content storage quota failures, and malformed optional meeting data.

## Files created

- src/components/dashboard/dashboard.tsx
- src/components/meetings/meeting-list.tsx
- src/components/meetings/meeting-workspace.tsx
- src/components/meetings/meeting-content-page.tsx
- src/components/meetings/meeting-carry-over.tsx
- src/components/meetings/meeting-state.tsx
- src/components/ui/button-link.tsx
- src/data/mock/users.ts
- src/data/mock/meetings.ts
- src/data/mock/tasks.ts
- src/data/mock/activities.ts
- src/lib/meeting-format.ts
- docs/MEETING_WORKFLOW_FRONTEND.md

## Files modified

- src/app/(workspace)/dashboard/page.tsx
- src/app/(workspace)/dashboard/loading.tsx
- src/app/(workspace)/meetings/page.tsx
- src/app/(workspace)/meetings/new/page.tsx
- src/app/(workspace)/meetings/[meetingId]/page.tsx
- src/app/(workspace)/meetings/[meetingId]/content/page.tsx
- src/components/dashboard/stat-card.tsx
- src/components/dashboard/upcoming-meetings.tsx
- src/components/dashboard/task-preview.tsx
- src/components/dashboard/activity-feed.tsx
- src/components/meetings/meeting-card.tsx
- src/components/meetings/meeting-form.tsx
- src/components/meetings/meeting-header.tsx
- src/components/meetings/meeting-agenda.tsx
- src/components/meetings/meeting-participants.tsx
- src/components/meetings/meeting-files.tsx
- src/components/meetings/content-input.tsx
- src/components/ui/button.tsx
- src/hooks/use-meetings.ts
- src/services/meeting.service.ts
- src/types/meeting.ts
- docs/FRONTEND.md
