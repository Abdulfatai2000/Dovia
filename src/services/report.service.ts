import { DEMO_TODAY } from "@/data/mock/meetings";
import { getMeetings } from "./meeting.service";
import { getTasks } from "./task.service";
import { getTeamMembers } from "./team.service";
import { dateKey, isTaskOverdue, shiftDay, summarizeTasks, weekStart } from "@/lib/task-utils";
import type { Task } from "@/types/task";

export const reportRanges = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Month", "Previous Month"] as const;
export type ReportRange = typeof reportRanges[number];

/** Meeting statuses that mean the meeting actually took place or was captured. */
const heldStatuses = ["COMPLETED", "REVIEW", "PROCESSING"];
/** Ordered distribution buckets. Overdue is derived, so it never double counts an explicit status. */
const distributionOrder = ["COMPLETED", "IN_PROGRESS", "NOT_STARTED", "BLOCKED"] as const;
export const distributionLabels = ["Completed", "In Progress", "Not Started", "Blocked"] as const;

export function reportWindow(range: ReportRange) {
  const end = range === "Previous Month" ? shiftDay(DEMO_TODAY.slice(0, 7) + "-01", -1) : DEMO_TODAY;
  const start = range === "Last 7 Days" ? shiftDay(end, -6)
    : range === "Last 90 Days" ? shiftDay(end, -89)
    : range === "This Month" ? end.slice(0, 7) + "-01"
    : dateKey(new Date(`${end.slice(0, 7)}-01T12:00:00Z`));
  return { start, end };
}

function withinRange(date: string | undefined, start: string, end: string) {
  if (!date) return false;
  const key = date.slice(0, 10);
  return key >= start && key <= end;
}

/** Weekly buckets so the volume chart reads the same for every range. */
function volumeBuckets(start: string, end: string, held: { date: string }[]) {
  const buckets: { label: string; range: string; count: number }[] = [];
  let cursor = weekStart(start);
  let guard = 0;
  while (cursor <= end && guard < 40) {
    const last = shiftDay(cursor, 6) > end ? end : shiftDay(cursor, 6);
    buckets.push({ label: `${cursor.slice(5)} – ${last.slice(5)}`, range: `${cursor} to ${last}`, count: held.filter(meeting => meeting.date >= cursor && meeting.date <= last).length });
    cursor = shiftDay(cursor, 7);
    guard += 1;
  }
  return buckets;
}

function distribution(tasks: Task[]) {
  const completed = tasks.filter(task => task.status === "COMPLETED");
  const overdue = tasks.filter(isTaskOverdue);
  const buckets = distributionOrder.map((status, index) => {
    const count = tasks.filter(task => task.status === status).length;
    return { key: distributionLabels[index], status, count };
  });
  buckets.push({ key: "Overdue", status: "OVERDUE" as const, count: overdue.length });
  return { buckets, total: tasks.length, overdue: overdue.length, completed: completed.length };
}

/** The heaviest department by open commitments. Distribution only, never a ranking. */
function busiestDepartment(tasks: Task[], members: ReturnType<typeof getTeamMembers>) {
  const counts = new Map<string, number>();
  tasks.filter(task => task.status !== "COMPLETED").forEach(task => {
    const department = members.find(member => member.id === task.assigneeId)?.department;
    if (department) counts.set(department, (counts.get(department) ?? 0) + 1);
  });
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return top ? { department: top[0], open: top[1] } : null;
}

export function getReport(range: ReportRange) {
  const { start, end } = reportWindow(range);
  const allMeetings = getMeetings();
  const allTasks = getTasks();
  const members = getTeamMembers();

  const meetings = allMeetings.filter(meeting => withinRange(meeting.date, start, end));
  const meetingIds = new Set(meetings.map(meeting => meeting.id));
  const held = meetings.filter(meeting => heldStatuses.includes(meeting.status));

  // Meeting-generated tasks in range plus any task created in range, so manual demo tasks still count.
  const tasks = allTasks.filter(task => (task.meetingId !== undefined && meetingIds.has(task.meetingId)) || withinRange(task.createdAt, start, end));
  const linked = tasks.filter(task => task.meetingId !== undefined && meetingIds.has(task.meetingId));
  const completedInRange = allTasks.filter(task => task.status === "COMPLETED" && withinRange(task.completedAt, start, end));
  const linkedCompleted = linked.filter(task => task.status === "COMPLETED").length;

  const followUp = meetings
    .map(meeting => {
      const meetingTasks = allTasks.filter(task => task.meetingId === meeting.id);
      return { meeting, tasks: meetingTasks, stats: summarizeTasks(meetingTasks) };
    })
    .filter(item => item.tasks.length > 0 || heldStatuses.includes(item.meeting.status))
    .sort((a, b) => b.meeting.date.localeCompare(a.meeting.date));

  const stats = summarizeTasks(tasks);
  const needingAttention = followUp.filter(item => item.stats.open > 0);
  const heavy = busiestDepartment(tasks, members);

  const insights: string[] = [];
  const overdueMeetings = new Set(stats.overdue > 0 ? tasks.filter(isTaskOverdue).map(task => task.meetingId).filter(Boolean) : []);
  if (stats.overdue > 0) insights.push(`${stats.overdue} task${stats.overdue === 1 ? " is" : "s are"} overdue across ${overdueMeetings.size} meeting${overdueMeetings.size === 1 ? "" : "s"}.`);
  if (heavy) insights.push(`Most open tasks are currently assigned to the ${heavy.department} team (${heavy.open} open).`);
  if (needingAttention.length > 0) insights.push(`${needingAttention.length} meeting${needingAttention.length === 1 ? "" : "s"} still ${needingAttention.length === 1 ? "has" : "have"} unfinished follow-up work.`);
  if (completedInRange.length > 0) insights.push(`${completedInRange.length} task${completedInRange.length === 1 ? " was" : "s were"} completed during the selected period.`);
  if (stats.blocked > 0) insights.push(`${stats.blocked} task${stats.blocked === 1 ? " is" : "s are"} blocked and waiting on someone else.`);
  if (!insights.length) insights.push("No follow-up activity in the selected period yet.");

  return {
    range, start, end,
    meetings, held, tasks, linked, stats,
    completedInRange,
    overdue: tasks.filter(isTaskOverdue),
    followUpRate: { completed: linkedCompleted, total: linked.length, percent: linked.length ? Math.round(linkedCompleted / linked.length * 100) : 0 },
    buckets: volumeBuckets(start, end, held),
    distribution: distribution(tasks),
    followUp,
    workload: members.map(member => ({ member, stats: summarizeTasks(tasks.filter(task => task.assigneeId === member.id)) })),
    insights,
    hasData: meetings.length > 0 || tasks.length > 0,
  };
}