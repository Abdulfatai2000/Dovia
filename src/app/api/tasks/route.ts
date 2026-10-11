import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { listTasks } from "@/server/repositories/task.repository";
import { createTask } from "@/server/services/task.service";
export function GET(request: Request) { return api(async () => listTasks(await requireWorkspaceSession(), new URL(request.url).searchParams)); }
export function POST(request: Request) { return api(async () => createTask(await requireWorkspaceSession(), await jsonBody(request))); }
