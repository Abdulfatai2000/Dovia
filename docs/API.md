# Dovia API Contract

> **Status:** API modules exist as placeholders from Phase 0.  
> **Implementation:** deferred until backend development after frontend completion.

## 1. General rules

All protected APIs must eventually:
1. resolve authenticated user
2. resolve active workspace
3. authorize the operation
4. validate input
5. execute domain logic
6. return a stable DTO

Never trust client-provided:
- `userId`
- `workspaceId`
- role
- assignee authorization

## 2. Response convention

Recommended success response:

```json
{
  "success": true,
  "data": {}
}
```

Recommended error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request is invalid.",
    "fieldErrors": {}
  }
}
```

Do not leak stack traces, database internals, tokens, or provider responses to the client.

## 3. Status-code guideline

| Code | Meaning |
|---|---|
| 200 | Successful read/update |
| 201 | Resource created |
| 204 | Successful operation with no body |
| 400 | Invalid request |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized |
| 404 | Resource not found in authorized scope |
| 409 | Conflict/idempotency issue |
| 413 | Content too large |
| 422 | Semantically invalid input |
| 429 | Rate limited |
| 500 | Unexpected server failure |
| 502/503 | External provider unavailable |

## 4. Meeting APIs

### `GET /api/meetings`

List workspace meetings.

Future query parameters:
- `status`
- `teamId`
- `from`
- `to`
- `search`
- `page`
- `limit`

### `POST /api/meetings`

Create a meeting.

Example request:

```json
{
  "title": "Product Strategy Sync",
  "description": "Review launch readiness.",
  "date": "2026-10-05",
  "startTime": "10:00",
  "duration": 60,
  "teamId": "team_id",
  "participantIds": ["user_id"],
  "agenda": ["Review previous actions", "Discuss blockers"]
}
```

### `GET /api/meetings/[meetingId]`

Returns one meeting within the caller's workspace authorization.

### `PATCH /api/meetings/[meetingId]`

Update allowed meeting fields.

### `DELETE /api/meetings/[meetingId]`

Delete/cancel according to business rules.

### `POST /api/meetings/[meetingId]/content`

Save notes/transcript metadata/content.

### `POST /api/meetings/[meetingId]/analyze`

Run Groq analysis and create/update a draft `MeetingAnalysis`.

### `POST /api/meetings/[meetingId]/confirm`

Confirm human-reviewed outcome.

This endpoint is business-critical and should be idempotent.

Future behavior:
- validate organizer/editor permission
- validate confirmed decisions/action items
- map assignees to authorized workspace users
- create durable decisions
- create tasks
- mark meeting completed
- create activity events

### `GET /api/meetings/[meetingId]/follow-up`

Return aggregate follow-up data.

Example shape:

```json
{
  "success": true,
  "data": {
    "total": 12,
    "completed": 8,
    "inProgress": 2,
    "notStarted": 0,
    "overdue": 2,
    "completionRate": 67,
    "tasks": []
  }
}
```

## 5. Task APIs

### `GET /api/tasks`

Future filters:
- `status`
- `priority`
- `assigneeId`
- `meetingId`
- `due`
- `search`

### `POST /api/tasks`

Manual task creation, subject to workspace authorization.

### `GET /api/tasks/[taskId]`

Task detail.

### `PATCH /api/tasks/[taskId]`

Update allowed fields such as:
- title
- description
- assignee
- dueDate
- priority
- status
- blockedReason

### `DELETE /api/tasks/[taskId]`

Delete subject to permissions/audit rules.

## 6. Team APIs

- `GET /api/teams`
- `POST /api/teams`
- `GET /api/teams/[teamId]`
- `PATCH /api/teams/[teamId]`
- `DELETE /api/teams/[teamId]`
- `GET /api/teams/[teamId]/members`
- `POST /api/teams/[teamId]/members`

## 7. Notifications

### `GET /api/notifications`

Return current user's notifications.

### `PATCH /api/notifications`

Support read-state updates such as:
- mark one read
- mark all read

## 8. Reports

### `GET /api/reports`

Return server-calculated aggregates. The frontend should not independently invent canonical totals when the backend is available.

Potential dimensions:
- date range
- team
- meeting
- task status

## 9. AI utility routes

- `POST /api/ai/summarize`
- `POST /api/ai/regenerate`

Prefer meeting-scoped APIs for normal product flow; generic AI endpoints should remain narrow.

## 10. Uploads

### `POST /api/uploads`

Future responsibilities:
- authorize upload
- validate MIME type
- enforce size limits
- write to approved storage
- return metadata/reference, not secret provider credentials

## 11. Integrations

- `/api/integrations/google`
- `/api/integrations/microsoft`
- `/api/integrations/slack`

These will later handle connection state/OAuth callbacks according to provider requirements.

## 12. Idempotency

Operations that can create duplicate durable data should have protection.

Most important:
- meeting confirmation
- integration webhook processing
- job-triggered reminders

## 13. Frontend contract principle

The frontend should call typed service functions instead of scattering `fetch()` calls across page components.

```text
Page/component
→ hook
→ frontend service
→ API
```

During frontend-first development, the service can use a mock adapter with the same return types.
