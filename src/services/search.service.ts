import { getMeetings } from "./meeting.service";
import { getTasks } from "./task.service";
import { getTeamMembers } from "./team.service";
import { getConfirmedOutcomes } from "./meeting-outcome.service";
import { taskHref } from "@/lib/task-utils";

export const searchGroups = ["Meetings", "Tasks", "People", "Decisions"] as const;
export type SearchGroup = typeof searchGroups[number];

export interface SearchResult {
  id: string;
  group: SearchGroup;
  title: string;
  context: string;
  href: string;
}

/** Canonical, entity-agnostic index shared by every search surface. */
export function getSearchIndex(): SearchResult[] {
  const meetings = getMeetings();
  const meetingTitle = (id?: string) => meetings.find(meeting => meeting.id === id)?.title ?? "Confirmed meeting outcome";
  return [
    ...meetings.map(meeting => ({ id: meeting.id, group: "Meetings" as const, title: meeting.title, context: `${meeting.team} · ${meeting.date} · ${meeting.meetingType}`, href: `/meetings/${meeting.id}` })),
    ...getTasks().map(task => ({ id: task.id, group: "Tasks" as const, title: task.title, context: task.meetingId ? `From ${meetingTitle(task.meetingId)}` : "Standalone demo task", href: taskHref(task.id) })),
    ...getTeamMembers().map(user => ({ id: user.id, group: "People" as const, title: user.name, context: `${user.role} · ${user.department}`, href: `/team/${user.id}` })),
    ...getConfirmedOutcomes().flatMap(outcome => outcome.decisions.map(decision => ({ id: `${outcome.meetingId}:${decision.id}`, group: "Decisions" as const, title: decision.description, context: `Confirmed in ${meetingTitle(outcome.meetingId)}`, href: `/meetings/${outcome.meetingId}` }))),
  ];
}

export interface SearchGroupsResult { query: string; groups: { group: SearchGroup; results: SearchResult[] }[]; total: number; }

/** Substring match across title and context, grouped in the order defined by `searchGroups`. */
export function searchWorkspace(rawQuery: string, limitPerGroup = 4): SearchGroupsResult {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return { query: rawQuery.trim(), groups: [], total: 0 };
  const matches = getSearchIndex().filter(result => `${result.title} ${result.context}`.toLowerCase().includes(query));
  const groups = searchGroups
    .map(group => ({ group, results: matches.filter(result => result.group === group).slice(0, limitPerGroup) }))
    .filter(entry => entry.results.length > 0);
  return { query: rawQuery.trim(), groups, total: matches.length };
}