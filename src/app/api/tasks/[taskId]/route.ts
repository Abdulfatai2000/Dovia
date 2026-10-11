import { api, jsonBody } from "@/server/api";
import { requireWorkspaceSession } from "@/server/workspace-session";
import { getTask } from "@/server/repositories/task.repository";
import { updateTask, deleteTask } from "@/server/services/task.service";
type Context = { params: Promise<{ taskId: string }> };
export function GET(_request: Request, context: Context) { return api(async () => getTask(await requireWorkspaceSession(), (await context.params).taskId)); }
export function PATCH(request: Request, context: Context) { return api(async () => updateTask(await requireWorkspaceSession(), (await context.params).taskId, await jsonBody(request))); }
export function DELETE(_request: Request, context: Context) { return api(async () => deleteTask(await requireWorkspaceSession(), (await context.params).taskId)); }
