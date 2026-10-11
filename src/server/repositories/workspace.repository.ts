import { Membership } from "../models/membership";
import { User } from "../models/user";
import { Team } from "../models/team";
import { ApiError } from "../api";
import type { WorkspaceContext } from "../workspace-session";
export async function validateMembers(context: WorkspaceContext, userIds: string[]) {
  const unique = [...new Set(userIds)];
  const members = await Membership.find({ workspaceId: context.workspaceId, userId: { $in: unique }, status: "ACTIVE" }).select("userId").lean();
  const count = await User.countDocuments({ _id: { $in: members.map(m => m.userId) }, status: "ACTIVE" });
  if (count !== unique.length) throw new ApiError(400, "INVALID_MEMBER", "Choose active members of this workspace.");
}
export async function workspaceMembers(context: WorkspaceContext) {
  const memberships = await Membership.find({ workspaceId: context.workspaceId, status: "ACTIVE" }).limit(100).lean();
  const users = await User.find({ _id: { $in: memberships.map(m => m.userId) }, status: "ACTIVE" }).select("name email avatarUrl jobTitle").lean();
  return users.map(user => ({ id: user._id.toString(), name: user.name, email: user.email, avatarUrl: user.avatarUrl, image: user.avatarUrl, jobTitle: user.jobTitle ?? "", membershipRole: memberships.find(m => String(m.userId) === String(user._id))!.role, role: user.jobTitle || "Member", department: "Workspace", status: "Active" as const }));
}
export async function validateTeam(context: WorkspaceContext, teamId: string) {
  if (!await Team.exists({ _id: teamId, workspaceId: context.workspaceId, deletedAt: null })) throw new ApiError(404, "NOT_FOUND", "Team not found.");
}
