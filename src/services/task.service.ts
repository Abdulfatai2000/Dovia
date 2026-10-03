import { tasks } from "@/data/mock/tasks";
import { getConfirmedDemoTasks } from "./meeting-outcome.service";
/** Frontend-only source for later task pages; confirmation replaces rather than duplicates. */
export function getTasks() { return [...tasks, ...getConfirmedDemoTasks()]; }
