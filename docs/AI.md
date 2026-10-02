# AI analysis plan

Meeting notes or transcript → Backend receives content → Validate content → Send content to Groq → Groq returns structured analysis → Validate structured response → Save draft MeetingAnalysis → Organizer reviews/edits results → Organizer confirms meeting outcome → Backend creates final tasks and decisions → MongoDB persists confirmed records → Follow-up tracking begins.

AI should eventually extract:

1. Meeting summary
2. Key decisions
3. Action items
4. Suggested assignees
5. Suggested deadlines
6. Open questions
7. Risks/blockers
8. Important notes

AI output is only a draft. Never automatically create trusted final tasks directly from raw Groq output. Human confirmation must happen before final task creation.

Groq configuration and calls are deferred. Secrets stay on the server.
