import "server-only";
import { ApiError } from "@/server/api";
import { meetingAnalysisPrompt } from "./prompt";

export function aiConfiguration() {
  if (process.env.NEXT_PUBLIC_ENABLE_AI !== "true") throw new ApiError(503, "AI_DISABLED", "Meeting AI is currently disabled.");
  const key = process.env.GROQ_API_KEY?.trim();
  const model = process.env.GROQ_MODEL?.trim();
  if (!key || !model) throw new ApiError(503, "AI_NOT_CONFIGURED", "Meeting AI is not configured yet.");
  return { key, model };
}

export async function analyzeWithGroq(rawText: string, scheduledAt: Date) {
  const { key, model } = aiConfiguration();
  if (!rawText.trim() || rawText.length > 100_000) throw new ApiError(400, "MEETING_CONTENT_REQUIRED", "Add meeting text of up to 100,000 characters before analyzing.");
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(60_000),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, temperature: 0.1, max_completion_tokens: 6000,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: meetingAnalysisPrompt },
          { role: "user", content: JSON.stringify({ meetingDate: scheduledAt.toISOString(), transcript: rawText }) }],
      }),
    });
    if (!response.ok) throw new ApiError(502, "AI_ANALYSIS_FAILED", "The AI provider could not analyze this meeting. Please try again later.");
    const envelope = await response.json() as { choices?: { finish_reason?: string; message?: { content?: unknown } }[] };
    const choice = envelope.choices?.[0];
    if (choice?.finish_reason !== "stop" || typeof choice.message?.content !== "string" || choice.message.content.length > 150_000) {
      throw new ApiError(502, "AI_OUTPUT_INVALID", "The AI response was incomplete or invalid. Please regenerate.");
    }
    let output: unknown;
    try { output = JSON.parse(choice.message.content); }
    catch { throw new ApiError(502, "AI_OUTPUT_INVALID", "The AI response was not valid JSON. Please regenerate."); }
    return { model, output };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, "AI_ANALYSIS_FAILED", "Meeting analysis timed out or failed. Please try again.");
  }
}
