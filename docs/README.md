# Dovia Documentation Index

This folder is the source of truth for the Dovia project.

## Documents

| File | Purpose |
|---|---|
| `SRS.md` | Complete product requirements, workflow, page specification, architecture, security, testing and roadmap |
| `FRONTEND.md` | Frontend implementation handbook and phased execution plan |
| `BACKEND.md` | Backend, MongoDB, security, Groq and deployment implementation handbook |
| `ROUTES.md` | Frontend and API route map |
| `DESIGN_SYSTEM.md` | Official visual tokens and reusable component rules |
| `API.md` | API contract and endpoint responsibilities |
| `DATABASE.md` | MongoDB collection and relationship design |
| `AI.md` | Groq meeting-analysis pipeline and human-review rules |
| `ENVIRONMENT.md` | `.env.local` / `.env.example` policy and variable reference |

## Current implementation order

```text
Phase 0 — Routes and scaffold ✅
Phase 1 — Design system ← current
Phase 2 — Workspace shell/navigation
Phase 3 — Marketing/authentication UI
Phase 4 — Dashboard
Phase 5 — Meetings/preparation
Phase 6 — Meeting content
Phase 7 — AI review UI
Phase 8 — Completed meeting workspace
Phase 9 — My Tasks
Phase 10 — Follow-up progress
Phase 11 — Calendar
Phase 12 — Team
Phase 13 — Reports
Phase 14 — Notifications
Phase 15 — Settings
Phase 16 — Search/filter/navigation integration
Phase 17 — Frontend data/mock service architecture
Phase 18 — Interactive demo persistence
Phase 19 — Responsive refinement
Phase 20 — Accessibility and state coverage
Phase 21 — End-to-end frontend QA
Phase 22 — Frontend production validation
Then backend implementation begins.
```

## Core product rule

Dovia is not only a meeting summarizer.

```text
Meeting
→ Decision
→ Action Item
→ Owner
→ Deadline
→ Progress
→ Follow-up
→ Next Meeting
```
