import { TaskPriority, TaskStatus } from "./constants";
import { choice, date, invalid, objectId, only, text } from "./validation";
export function taskInput(body: Record<string, unknown>, partial = false) {
  only(body, partial ? ["title", "description", "assigneeId", "dueDate", "priority", "status", "blockedReason"] : ["title", "description", "assigneeId", "dueDate", "priority", "status", "blockedReason", "meetingId", "decisionId", "source"]);
  if (!partial && body.title === undefined) invalid("title");
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (["title", "description", "blockedReason"].includes(key)) result[key] = text(value, key, key === "title" ? 200 : 10000, key === "title");
    else if (["assigneeId", "meetingId", "decisionId"].includes(key)) result[key] = value === "" || value === null ? null : objectId(value, key);
    else if (key === "dueDate") result[key] = value === "" || value === null ? null : date(value, key);
    else if (key === "priority") result[key] = choice(value, TaskPriority, key);
    else if (key === "status") result[key] = choice(value, TaskStatus, key);
    else if (key === "source") result[key] = choice(value, ["MANUAL"] as const, key);
  }
  return result;
}
