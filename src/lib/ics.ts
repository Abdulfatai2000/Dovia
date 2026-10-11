import type { Meeting } from "@/server/models/meeting";

function escapeIcsValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

function formatIcsDate(date: Date, allDay = false): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (allDay) {
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
  }
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function generateUid(meetingId: string): string {
  return `${meetingId}@dovia.app`;
}

export function generateIcsContent(meeting: Meeting & { organizerName?: string; organizerEmail?: string }): string {
  const startDate = new Date(meeting.scheduledAt);
  const endDate = new Date(startDate.getTime() + meeting.durationMinutes * 60000);
  const uid = generateUid(meeting.id);
  const createdAt = new Date(meeting.createdAt || Date.now());
  const lastModified = new Date(meeting.updatedAt || Date.now());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dovia//Meeting Export//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(createdAt)}`,
    `CREATED:${formatIcsDate(createdAt)}`,
    `LAST-MODIFIED:${formatIcsDate(lastModified)}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${escapeIcsValue(meeting.title)}`,
  ];

  if (meeting.description) {
    lines.push(`DESCRIPTION:${escapeIcsValue(meeting.description)}`);
  }

  if (meeting.timezone && meeting.timezone !== "UTC") {
    lines.push(`TZID:${escapeIcsValue(meeting.timezone)}`);
  }

  if (meeting.externalMeetingUrl) {
    lines.push(`LOCATION:${escapeIcsValue(meeting.externalMeetingUrl)}`);
    lines.push(`URL:${escapeIcsValue(meeting.externalMeetingUrl)}`);
  }

  if (meeting.organizerName && meeting.organizerEmail) {
    lines.push(`ORGANIZER;CN=${escapeIcsValue(meeting.organizerName)}:mailto:${meeting.organizerEmail}`);
  }

  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

export function generateIcsFileName(meeting: Meeting): string {
  const safeTitle = meeting.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return `${safeTitle}-${meeting.id}.ics`;
}