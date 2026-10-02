# Dovia Database Design

> **Database:** MongoDB Atlas  
> **ODM:** Mongoose planned for backend implementation.  
> **Current status:** schema design only; frontend development happens first.

## 1. Core relationship model

```text
User
 └─ Membership ─ Workspace
                    ├─ Team
                    ├─ Meeting
                    │    ├─ MeetingContent
                    │    ├─ MeetingAnalysis
                    │    ├─ Decision
                    │    └─ Task
                    ├─ Notification
                    ├─ Activity
                    └─ Integration
```

Every protected document must be scoped to a workspace.

## 2. Core collections

### `users`

Purpose: identity/profile information.

Suggested fields:
- `_id`
- `name`
- `email`
- `image`
- `jobTitle`
- `timezone`
- `createdAt`
- `updatedAt`

### `workspaces`

Purpose: company/team workspace.

Suggested fields:
- `_id`
- `name`
- `slug`
- `ownerId`
- `settings`
- `createdAt`
- `updatedAt`

### `memberships`

Recommended separate collection when workspace roles and lifecycle become significant.

Fields:
- `_id`
- `workspaceId`
- `userId`
- `role`
- `status`
- `joinedAt`

Roles can begin with:
- `OWNER`
- `ADMIN`
- `MEMBER`

### `teams`

Fields:
- `_id`
- `workspaceId`
- `name`
- `description`
- `memberIds`
- `createdBy`
- timestamps

### `meetings`

Fields:
- `_id`
- `workspaceId`
- `teamId`
- `title`
- `description`
- `date`
- `startTime`
- `duration`
- `timezone`
- `platform`
- `externalMeetingUrl`
- `status`
- `organizerId`
- `participants`
- `agenda`
- `carryOver`
- `confirmedAt`
- timestamps

Meeting statuses:
- `DRAFT`
- `SCHEDULED`
- `IN_PROGRESS`
- `PROCESSING`
- `REVIEW`
- `COMPLETED`
- `CANCELLED`

### `meetingcontents`

Keep potentially large/raw content separate from the main meeting.

Fields:
- `_id`
- `workspaceId`
- `meetingId`
- `type` (`NOTES`, `TRANSCRIPT`, `FILE`, etc.)
- `text`
- `fileMetadata`
- `createdBy`
- timestamps

### `meetinganalyses`

Stores AI draft output separately from trusted confirmed outcome.

Fields:
- `_id`
- `workspaceId`
- `meetingId`
- `status`
- `model`
- `summary`
- `decisions[]`
- `actionItems[]`
- `openQuestions[]`
- `risks[]`
- `importantNotes[]`
- `rawMetadata`
- `createdBy`
- timestamps

Important rule: this document is a draft until a human confirms it.

### `decisions`

Durable confirmed meeting decisions.

Fields:
- `_id`
- `workspaceId`
- `meetingId`
- `text`
- `confirmedBy`
- `confirmedAt`
- timestamps

### `tasks`

Fields:
- `_id`
- `workspaceId`
- `meetingId`
- `teamId`
- `title`
- `description`
- `assigneeId`
- `createdBy`
- `dueDate`
- `priority`
- `status`
- `blockedReason`
- `completedAt`
- timestamps

Task statuses:
- `NOT_STARTED`
- `IN_PROGRESS`
- `BLOCKED`
- `COMPLETED`
- `OVERDUE`

Priorities:
- `LOW`
- `MEDIUM`
- `HIGH`
- `URGENT`

### `notifications`

Fields:
- `_id`
- `workspaceId`
- `userId`
- `type`
- `title`
- `message`
- `entityType`
- `entityId`
- `readAt`
- timestamps

### `activities`

Audit/activity feed events.

Fields:
- `_id`
- `workspaceId`
- `actorId`
- `type`
- `entityType`
- `entityId`
- `metadata`
- `createdAt`

### `integrations`

Fields:
- `_id`
- `workspaceId`
- `provider`
- `status`
- encrypted token/reference fields
- provider metadata
- timestamps

Never return provider secrets to the browser.

## 3. Embed versus reference

Good candidates to embed:
- bounded meeting agenda entries
- participant snapshots
- simple carry-over summaries

Prefer references/separate collections for:
- large transcripts
- files
- AI analysis history
- tasks
- notifications
- activity events
- integrations

## 4. Suggested indexes

Examples:

```text
users.email UNIQUE

memberships:
(workspaceId, userId) UNIQUE

meetings:
(workspaceId, date)
(workspaceId, status)
(workspaceId, teamId, date)

tasks:
(workspaceId, assigneeId, status)
(workspaceId, dueDate)
(meetingId, status)

notifications:
(userId, readAt, createdAt)

activities:
(workspaceId, createdAt)
(entityType, entityId, createdAt)
```

## 5. Security rule

Never query a protected object only by its `_id`.

Prefer:

```text
{ _id: objectId, workspaceId: authorizedWorkspaceId }
```

This reduces cross-workspace data leakage risk.

## 6. Confirmation transaction

Meeting confirmation should eventually run as one idempotent operation:

1. verify organizer permission
2. load meeting and current draft analysis
3. validate edited confirmed output
4. create/update durable decisions
5. create tasks from confirmed action items
6. mark meeting completed
7. mark analysis confirmed
8. write activity events
9. commit transaction

The same confirmation request must not create duplicate tasks.
