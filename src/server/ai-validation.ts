import { z } from "zod";
import { ApiError } from "./api";

const line = z.string().trim().min(1).max(4000);
const optionalText = z.string().trim().max(4000).optional();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(value); return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
});
const priority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
const status = z.enum(["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "COMPLETED"]);
const objectId = z.string().regex(/^[a-f0-9]{24}$/i);
const itemId = z.string().min(1).max(100);

export const providerSchema = z.object({
  summary: z.string().trim().min(1).max(15000),
  decisions: z.array(z.object({ text: line, context: optionalText }).strict()).max(50),
  actionItems: z.array(z.object({ title: z.string().trim().min(1).max(200), description: optionalText,
    suggestedAssigneeName: z.string().trim().max(200).optional(), suggestedAssigneeEmail: z.string().email().max(254).optional(),
    suggestedDueDate: date.optional(), priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  }).strict()).max(50),
  openQuestions: z.array(z.object({ text: line, ownerSuggestion: optionalText }).strict()).max(50),
  risks: z.array(z.object({ text: line, severity: z.enum(["LOW", "MEDIUM", "HIGH"]), mitigation: optionalText }).strict()).max(50),
  notes: z.string().max(15000),
}).strict();

export const reviewedSchema = z.object({
  analysisId: objectId,
  summary: z.string().trim().min(1).max(15000),
  decisions: z.array(z.object({ id: itemId, description: line }).strict()).max(50),
  actionItems: z.array(z.object({ id: itemId, title: z.string().trim().min(1).max(200), description: optionalText,
    assigneeId: objectId, suggestedDeadline: z.union([date, z.literal("")]).optional(), priority, status,
  }).strict()).max(50),
  openQuestions: z.array(z.object({ id: itemId, question: line }).strict()).max(50),
  risks: z.array(z.object({ id: itemId, description: line, severity: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM") }).strict()).max(50),
  importantNotes: z.array(z.string().max(4000)).max(100),
}).strict().refine(value => [value.decisions, value.actionItems, value.openQuestions, value.risks].every(items => new Set(items.map(item => item.id)).size === items.length), "Duplicate item IDs");

export function validateProviderOutput(value: unknown) {
  const result = providerSchema.safeParse(value);
  if (!result.success) throw new ApiError(502, "AI_OUTPUT_INVALID", "The AI response did not match the required meeting format. Please regenerate.");
  return result.data;
}
export function validateReviewedOutput(value: unknown) {
  const result = reviewedSchema.safeParse(value);
  if (!result.success) throw new ApiError(400, "INVALID_INPUT", "Review all fields and choose a workspace owner for every action item.");
  return result.data;
}
