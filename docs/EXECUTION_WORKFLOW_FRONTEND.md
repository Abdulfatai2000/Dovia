# Master Phase 2 — Execution workflow frontend

Confirmed Meeting → Task → Owner → Deadline → Progress → Follow-Up → Calendar → Team.

This is frontend persistence only. There is no backend, API call, cloud store, email, notification delivery, or external calendar connection.

## Shared data

`task.service.ts` combines the original seed tasks, action items derived from confirmed meeting outcomes, and manually created demo tasks. Stable confirmed IDs from Master Phase 1 are retained. The same task source feeds My Tasks, task detail, follow-up, calendar, team/member views, and the dashboard task preview/counts. Meeting and user data also come from their existing shared sources.

The `dovia_demo_tasks` key contains:

- manual task records;
- field-level overrides for seed/confirmed tasks, with the original source value for each overridden field;
- a small activity record for each frontend mutation.

Task updates do not duplicate confirmed action items. Reconfirmation updates the existing derived task by ID. A newly reviewed source field supersedes an older override for that field; unchanged source fields retain execution edits. Action items removed from an outcome disappear from task views even if an inactive override remains in browser storage. The confirmed meeting record remains the reviewed baseline; execution changes are visible in follow-up and task views.

The task service exposes getTasks, getTask, getTasksForMeeting, getTasksForUser, updateTask, createTask, getTaskStats, and getTaskActivity. Storage parsing and writes stay behind the service. Failed writes surface an error without reporting success. The useTasks hook reloads after same-tab task/outcome events and cross-tab storage changes.

## Task experience

My Tasks initially filters to the demo user Abdulfatai; choosing All owners exposes workspace tasks. All/Today/Upcoming/Overdue/Completed counts derive from the currently filtered dataset. Search, status, priority, source meeting, owner, and exact due-date filters work locally.

Desktop tables become cards below 1024px. Source meetings remain linked in lists and detail views. Status can be updated directly, with an optional blocked-reason dialog. Completion stores a frontend completedAt timestamp; reopening clears it. Detail editing supports title, description, owner, deadline, priority, status, and blocked reason. Manual creation uses the shared modal and validates title, owner, enums, and dates. Activity is generated from actual local changes; comments are not implemented.

## Follow-up

The meeting follow-up route filters the shared tasks by meetingId. Summary counts and completion progress derive from those tasks. Zero tasks produces a safe 0% and an empty state. The segmented distribution shows explicit statuses with labels/counts. The overdue total additionally includes unfinished tasks with dates before the demo calendar day; these may still have a status such as In Progress or Blocked. Direct status edits use the same service.

## Calendar

Month/Week/Day views use a lightweight custom calendar, with Previous/Today/Next navigation. Meetings and task deadlines come from shared records. An open task linked to a meeting is labeled Follow-up rather than duplicated as a second event. Completed tasks retain their deadline entries. Month view is compact on mobile, with a selected-day agenda below it; week/day views use readable lists. An upcoming-meetings panel and visual reminder list derive from the same data. No reminders are sent.

The existing fixed demo calendar is retained: Today means October 5, 2026, and weeks start Monday. This keeps seeded meetings, due-date calculations, and summaries consistent without render-time clock differences. Mutation timestamps use the actual browser clock and are displayed in UTC.

## Team

The existing mock users now carry department and static Active/Away labels, shared with all owner and participant selectors. Team search, member tables/cards, workload counts, recent local/seed activity, and member details reuse current task/meeting data. Members remain in their original order, with no rankings or performance scores. Member details link assigned tasks and participant meetings. Invite Member validates a preview and explicitly states that email is not connected; it does not create members or invitations.

## Main files

- Services: task.service.ts, team.service.ts, small confirmed-task projection update in meeting-outcome.service.ts.
- Shared data/helpers: types/task.ts, data/mock/users.ts, hooks/use-tasks.ts, lib/task-utils.ts, lib/calendar.ts.
- Tasks: components/tasks/ task table/cards, filters, form, detail, list, activity, status and feedback.
- Follow-up: components/meetings/follow-up-progress.tsx.
- Calendar: components/calendar/calendar-view.tsx and calendar-event.tsx.
- Team: components/team/ table/cards, invite dialog, team and member detail.
- Routes: /tasks, /tasks/[taskId], /meetings/[meetingId]/follow-up, /calendar, /team, /team/[memberId].
- Dashboard: task data integration only; existing layout retained.

Existing UI primitives supply labels, keyboard navigation, modal focus handling, status text, error feedback, loading states, and scroll-safe tables. No packages were added. Marketing, auth, AI Review, completed meeting presentation, and the workspace shell were not redesigned. Reports, full notifications, settings, search, and backend work remain deferred.

Validation follows quota-saving mode: lint followed by build at the end, rerunning only a failed command after fixing its reported issue. No browser automation, screenshots, accessibility scans, responsive browser tests, or temporary QA scripts are run; visual QA remains manual.
