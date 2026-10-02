# Dovia AI Design — Groq Meeting Intelligence

> **Provider planned:** Groq  
> **Rule:** AI proposes; humans confirm.

## 1. AI purpose

Dovia does not use AI merely to create meeting summaries. The AI layer turns unstructured meeting content into a draft execution plan that a human reviews before it becomes trusted workspace data.

## 2. Input

Possible inputs:
- pasted notes
- manually typed notes
- transcript text
- text extracted from supported documents
- later: transcripts from connected meeting platforms

## 3. Pipeline

```text
Meeting content
→ normalize input
→ validate size/type
→ server calls Groq
→ request structured output
→ validate output schema
→ persist MeetingAnalysis draft
→ show AI Review page
→ organizer edits/approves
→ confirmation endpoint
→ durable decisions/tasks
→ follow-up tracking
```

## 4. Required structured output

The model should produce a schema equivalent to:

```ts
type MeetingAnalysis = {
  summary: string;
  decisions: Array<{
    text: string;
    confidence?: number;
  }>;
  actionItems: Array<{
    title: string;
    description?: string;
    suggestedAssigneeName?: string;
    suggestedDueDate?: string;
    suggestedPriority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    confidence?: number;
  }>;
  openQuestions: Array<{
    text: string;
  }>;
  risks: Array<{
    text: string;
    severity?: "LOW" | "MEDIUM" | "HIGH";
  }>;
  importantNotes: Array<{
    text: string;
  }>;
};
```

The exact implementation may use Zod for runtime validation.

## 5. Assignee safety

The model may suggest a participant by **name**, but it must not invent or directly choose trusted internal IDs.

Server flow:

```text
AI suggested "Sarah Chen"
→ compare against actual meeting participants
→ frontend displays suggestion
→ organizer confirms/corrects
→ backend stores authorized assigneeId
```

## 6. Deadline handling

Treat AI deadlines as suggestions. Normalize only dates that can be safely interpreted from meeting context.

Do not silently convert ambiguous language such as "next week" into an authoritative deadline without review.

## 7. Prompt requirements

The system prompt should require:
- factual extraction from provided content
- no invented decisions
- no invented attendees
- concise summary
- clearly separated decisions and actions
- uncertainty when information is ambiguous
- structured JSON matching the schema
- no markdown wrapper around JSON when structured JSON is expected

## 8. Validation

Never trust the model response directly.

Validate:
- required keys
- array limits
- text lengths
- allowed enums
- date format
- malformed JSON
- output size

If validation fails, retry only within a bounded policy.

## 9. Failure behavior

If Groq is unavailable:
- do not lose the meeting content
- return a safe error
- leave the meeting in a recoverable state
- let the organizer retry
- do not create tasks

## 10. Regeneration

Regeneration can later support:
- entire analysis
- summary only
- action items only
- decisions only

Regeneration must not overwrite confirmed durable data without an explicit user action.

## 11. Privacy

Only send content necessary for the requested analysis.

The product should eventually provide:
- clear disclosure that AI is processing meeting content
- retention controls
- deletion controls
- workspace access control
- provider configuration appropriate to deployment

## 12. Environment variables

Server-only:

```env
GROQ_API_KEY=
GROQ_MODEL=
```

Never use `NEXT_PUBLIC_GROQ_API_KEY`.

## 13. Frontend-first development

During frontend phases, use a typed mock AI adapter. Do not call Groq from client components.

Recommended frontend abstraction:

```text
AI Review UI
→ aiService.analyzeMeeting(...)
→ mock adapter now
→ real `/api/meetings/[meetingId]/analyze` later
```
