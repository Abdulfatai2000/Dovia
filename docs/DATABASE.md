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


## Phase 3 persistence and authorization

User -> active Membership -> Workspace scopes every business query. Teams contain only active workspace users. Meetings reference organizer/participants/team; MeetingContent shares its parent workspace; Tasks reference same-workspace meetings/decisions and active assignees. Notification queries include both workspaceId and recipient userId. Activity metadata never contains transcripts or credentials.

Meeting, Task and Team DELETE operations set deletedAt (meetings also become CANCELLED). Normal resource lists and lookups exclude archived records. Related task records/history/content are intentionally retained; existing tasks can still be managed after their source meeting is archived. Nothing is cascaded or silently removed.

MeetingContent has a unique workspaceId+meetingId index for one current content record. Existing deployments with duplicate content records must reconcile them before provisioning that index. Mongoose declares indexes when models initialize; review index build permissions for deployment. Added query indexes cover workspace/scheduledAt, workspace/meetingId tasks and workspace/user/readAt notifications.

Stored task statuses: NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETED. Overdue is dueDate < current instant and not completed. Frontend dueAt retains the full timestamp while dueDate supplies date inputs. Dashboard totals use aggregation; reports query a bounded date window and compute deterministic summaries. No employee scores or rankings.

Migration: frontend service -> authenticated API -> validation/service/repository -> MongoDB. Meeting, content, task and notification adapters no longer read/write demo business localStorage. Existing demo values are neither imported nor deleted. Theme and UI settings remain local. Member identity comes from the authenticated workspace; AI mock generation is blocked for real MongoDB meeting IDs.
