DOVIA

Frontend Data Architecture

> Current implementation — Master Phase 3. This document describes how the Dovia frontend reads and writes data today. It is the reference for adding or changing any data-backed feature.

## Scope and honest boundaries

Dovia is **frontend only**. There is no backend, no database, no auth provider, no AI provider, and no third-party integration connected.

| Concern | Status in this frontend |
| --- | --- |
| Data source | Seed fixtures plus browser-local demo records |
| Persistence | `localStorage`, Dovia namespace only, temporary |
| Auth | No session, no token, no identity provider |
| Credentials | Never read, never stored, never validated against anything |
| AI processing | Illustrative drafts only; no model is called |
| Integrations | Preview surfaces only; no provider request is made |
| Notifications | Derived from local records; nothing is delivered by email or push |

Anything a service returns is **demo data**, not a server response. UI copy must not claim server persistence, a real session, or a completed connection.

---

## 1. The layer model

```
Page (app/**/page.tsx)
  └─ Feature component (components/<feature>/)
       └─ Hook if needed (hooks/use-*.ts)
            └─ Service (services/*.ts)
                 └─ Demo store / seed fixtures (lib/demo-store.ts, data/mock/*)
```

Rules that keep this boundary honest:

- Components never import `localStorage`, `DOVIA_STORAGE_PREFIX`, or a `data/mock` fixture to build a user-facing list. They receive data from a hook or a service call.
- Services never import React. They are plain functions over browser storage plus fixtures.
- Hooks never call `localStorage`. They subscribe to demo events and re-run a service function.
- Only `lib/demo-store.ts` and the service modules that own a domain store touch storage, and they go through the shared read/write helpers.

### Cross-cutting update mechanism

There is no Redux or Zustand layer. Freshness comes from three browser events dispatched by `lib/demo-store.ts` and the domain services:

| Event | Dispatched by | Refreshes |
| --- | --- | --- |
| `storage` | browser | every open tab (cross-tab sync) |
| `dovia-demo-changed` | any `writeStored` call | all Dovia demo consumers |
| `dovia-demo-reset` | `resetDemoData()` | all Dovia demo consumers |
| `dovia-demo-tasks-changed` | `task.service` | task-dependent views |
| `dovia-demo-outcomes-changed` | `meeting-outcome.service` | meeting, task, and report views |

`useDemoQuery(serviceFn)` wraps this. Pass a stable function (module-level or `useCallback`) so the subscription is not torn down on every render.

---

## 2. Services and their ownership

One canonical source per domain. A second copy of the same entity is the defect this architecture exists to prevent.

| Service | Owns | Reads | Writes |
| --- | --- | --- | --- |
| `meeting.service.ts` | Meetings and meeting content | `dovia_demo_meetings`, `dovia_demo_meeting_content_<id>`, `seedMeetings`, confirmed outcomes | meeting + content keys |
| `meeting-outcome.service.ts` | Confirmed meeting outcomes; derived task source | `dovia_demo_meeting_outcomes`, `sampleCompletedAnalysis` | outcome key |
| `task.service.ts` | Tasks (seed + confirmed + manual) and task activity | `dovia_demo_tasks`, `seedTasks`, confirmed actions | task key |
| `team.service.ts` | Users and the current user | `users` fixture, saved profile settings | none |
| `notification.service.ts` | Notification records and read state | seeds, meetings, tasks, confirmed outcomes | `dovia_demo_notification_read` |
| `report.service.ts` | Analytics derived from meetings and tasks | meeting, task, team services | none |
| `search.service.ts` | Cross-entity search index | meeting, task, team, outcome services | none |
| `settings.service.ts` | Profile, workspace, meeting defaults, notification preferences | `dovia_demo_settings` | settings key |
| `ai.service.ts` | Illustrative analysis drafts | analysis fixtures | none |

### Cross-domain references

```
Meeting ──organizerId / participants[].userId──▶ User.id
Task    ──meetingId──▶ Meeting.id
Task    ──assigneeId──▶ User.id
Notification ──taskId / meetingId──▶ Task.id / Meeting.id
SearchResult ──▶ the same canonical Meeting / Task / User / confirmed decision
```

One meeting outcome writes tasks and completed status together, so a confirmed meeting can never show up with duplicated action items. `task.service` de-duplicates by task id when it composes seed, confirmed, and manual tasks.

### Identity

`users` in `src/data/mock/users.ts` is the only person list. `CURRENT_USER_ID` in `src/lib/task-utils.ts` is the only current-user pointer. `team.service.getCurrentUser()` is the only way UI reads the signed-in person, and it reflects saved profile settings so an account rename stays consistent across the app.

---

## 3. Demo persistence

### Namespacing and versioning

Every record is written by `lib/demo-store.ts`:

- Keys must start with `dovia_demo_`. Writes outside the namespace are refused.
- Writes are enveloped as `{ version: 1, data }`. Reads reject an unknown version instead of guessing.
- Reads validate the stored shape. Invalid data raises a plain-language error and the UI shows an error state rather than rendering half-parsed records.
- `resetDemoData()` removes only `dovia_demo_` keys. It never calls `localStorage.clear()`.

### What persists

| Data | Key | Notes |
| --- | --- | --- |
| Created meetings | `dovia_demo_meetings` | validated on read |
| Meeting content | `dovia_demo_meeting_content_<id>` | per meeting |
| Confirmed outcomes | `dovia_demo_meeting_outcomes` | source of completed status and derived tasks |
| Manual tasks, task updates, task activity | `dovia_demo_tasks` | updates are stored as patches over the base record |
| Notification read state | `dovia_demo_notification_read` | notification bodies are always derived, never stored |
| All settings | `dovia_demo_settings` | profile, workspace, defaults, preferences |

### What does not persist

- Open dialogs, selected tabs, hover state, search text, filter selections.
- Passwords, auth tokens, OAuth secrets, API keys, 2FA secrets, uploaded file blobs.
- Profile photo previews. The chosen image lives in component state for the session and is discarded on refresh.

### Reset

`/settings` exposes **Reset Demo Data**, behind a confirmation dialog that states exactly what is cleared. This is a development and demo affordance and is the only supported way to recover from invalid stored data.

---

## 4. Feature data sources

| Surface | Data source |
| --- | --- |
| Dashboard | `useMeetings`, `useTasks`; counts derived from the same task records the task pages use |
| Meetings | `meeting.service` with confirmed outcomes reflected in status |
| AI Review / confirmation | `ai.service` draft plus `meeting-outcome.service` on confirm |
| Tasks, task detail | `task.service`; filters use shared `taskStatuses` / `taskPriorities` |
| Follow-up | `task.service` scoped by `meetingId` |
| Calendar | `useMeetings` plus task deadlines from `useTasks` |
| Team | `team.service` plus per-member task aggregates |
| Reports | `report.service`, calculated from meetings, tasks, and team data in the selected range |
| Notifications | `notification.service`; the Topbar badge reads the same records |
| Global search | `search.service` index over meetings, tasks, people, and confirmed decisions |
| Settings | `settings.service` via `useSettings` |

Filtering terminology is shared, not re-invented per page: task statuses are Not Started, In Progress, Blocked, Completed, Overdue; priorities are Low, Medium, High, Urgent.

---

## 5. Rules for new work

1. Extend the owning service. Do not read another domain's storage key.
2. Add a `useDemoQuery` hook when a component needs live refresh; do not add manual `addEventListener` wiring.
3. Derive analytics in a service, never inline in a component, so two surfaces cannot disagree.
4. Add new storage through `lib/demo-store` helpers so versioning and the reset guarantee are preserved.
5. Never store credentials or secrets, and never let a component read storage directly.
6. Label demo behaviour honestly in the UI. "Saved in this browser" is accurate; "Saved to your account" is not.