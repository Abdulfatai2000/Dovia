import { MeetingPlatform, MeetingStatus, MeetingType, MeetingContentType } from "./constants";
import { choice, date, ids, integer, invalid, objectId, only, text } from "./validation";
const keys = ["title", "description", "scheduledAt", "durationMinutes", "timezone", "platform", "meetingType", "teamId", "projectName", "participantIds", "agenda", "recurring", "externalMeetingUrl", "status"];
export function meetingInput(body: Record<string, unknown>, partial = false) {
  only(body, keys);
  const result: Record<string, unknown> = {};
  for (const key of ["title", "scheduledAt", "durationMinutes", "platform", "meetingType"]) if (!partial && body[key] === undefined) invalid(key);
  for (const [key, value] of Object.entries(body)) {
    if (["title", "description", "projectName"].includes(key)) result[key] = text(value, key, key === "description" ? 10000 : 200, key === "title");
    else if (key === "scheduledAt") result[key] = date(value, key);
    else if (key === "durationMinutes") result[key] = integer(value, key, 1, 1440);
    else if (key === "participantIds") result[key] = ids(value, key);
    else if (key === "teamId") result[key] = value === null || value === "" ? null : objectId(value, key);
    else if (key === "platform") result[key] = choice(value, MeetingPlatform, key);
    else if (key === "meetingType") result[key] = choice(value, MeetingType, key);
    else if (key === "status") result[key] = choice(value, MeetingStatus, key);
    else if (key === "recurring") { if (typeof value !== "boolean") invalid(key); result[key] = value; }
    else if (key === "timezone") { const zone = text(value, key, 100, true); try { new Intl.DateTimeFormat("en", { timeZone: zone }); } catch { invalid(key); } result[key] = zone; }
    else if (key === "externalMeetingUrl") { const url = text(value, key, 2000); if (url && !/^https?:\/\//i.test(url)) invalid(key); result[key] = url; }
    else if (key === "agenda") {
      if (!Array.isArray(value) || value.length > 100) invalid(key);
      result[key] = value.map((item: unknown, index: number) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return invalid("agenda item");
        const entry = item as Record<string, unknown>;
        return { id: String(index + 1), title: text(entry.title, "agenda title", 500, true), time: entry.time === undefined ? undefined : text(entry.time, "agenda time", 50) };
      });
    }
  }
  return result;
}
export function contentInput(body: Record<string, unknown>) {
  only(body, ["contentType", "rawText", "source", "files"]);
  const contentType = choice(body.contentType, MeetingContentType, "content type");
  if (typeof body.rawText !== "string" || body.rawText.length > 100000) invalid("content (maximum 100,000 characters)");
  const files = body.files ?? [];
  if (!Array.isArray(files) || files.length > 20) invalid("file metadata");
  return { contentType, rawText: body.rawText, characterCount: body.rawText.length,
    source: body.source === undefined ? undefined : text(body.source, "source", 200),
    files: files.map((item: unknown) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return invalid("file metadata");
      const file = item as Record<string, unknown>;
      only(file, ["name", "mimeType", "size"]);
      return { name: text(file.name, "file name", 255, true), mimeType: text(file.mimeType, "file type", 100, true), size: integer(file.size, "file size", 0, 25000000) };
    }),
  };
}
