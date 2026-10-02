# Database plan

Future persistence uses MongoDB and Mongoose. Model modules are documented placeholders: User, Workspace, Team, Meeting, Task, Notification, Activity, MeetingAnalysis, Integration.

Plan workspace-scoped relationships, meeting participants, decisions, task owners/deadlines, activity history, and follow-up links before implementing schemas and indexes. Starter domain types live in src/types; they are not database schemas. No connections are opened in Phase 0.
