import { Team } from "../models/team";
import { ApiError } from "../api";
import { ids, objectId, only, text } from "../validation";
import { validateMembers, workspaceMembers } from "../repositories/workspace.repository";
import { requireManager, type WorkspaceContext } from "../workspace-session";
export async function listTeams(context: WorkspaceContext) { return Team.find({ workspaceId: context.workspaceId, deletedAt: null }).sort({ name: 1 }).limit(100).lean(); }
export async function getTeam(context: WorkspaceContext, id: string) {
 const team = await Team.findOne({ _id: objectId(id), workspaceId: context.workspaceId, deletedAt: null });
 if (!team) throw new ApiError(404, "NOT_FOUND", "Team not found."); return team;
}
export async function saveTeam(context: WorkspaceContext, body: Record<string, unknown>, id?: string) {
 requireManager(context); only(body, ["name", "description", "memberIds"]);
 const input: Record<string, unknown> = {};
 if (!id || body.name !== undefined) input.name = text(body.name, "team name", 150, true);
 if (body.description !== undefined) input.description = text(body.description, "description", 2000);
 if (body.memberIds !== undefined) { input.memberIds = ids(body.memberIds, "members"); await validateMembers(context, input.memberIds as string[]); }
 if (id) { const team = await getTeam(context, id); team.set(input); return team.save(); }
 return Team.create({ ...input, workspaceId: context.workspaceId, createdBy: context.userId });
}
export async function deleteTeam(context: WorkspaceContext, id: string) { requireManager(context); const team = await getTeam(context, id); team.deletedAt = new Date(); await team.save(); return { deleted: true }; }
export async function teamMembers(context: WorkspaceContext, id: string) { const team = await getTeam(context, id); const members = await workspaceMembers(context); return members.filter(member => team.memberIds.some(value => String(value) === member.id)); }
export async function addMembers(context: WorkspaceContext, id: string, body: Record<string, unknown>) {
 requireManager(context); only(body, ["memberIds"]); const members = ids(body.memberIds, "members"); await validateMembers(context, members); await getTeam(context, id);
 return Team.findOneAndUpdate({ _id: id, workspaceId: context.workspaceId, deletedAt: null }, { $addToSet: { memberIds: { $each: members } } }, { new: true, runValidators: true });
}
