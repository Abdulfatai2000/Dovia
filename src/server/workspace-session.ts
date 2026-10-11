import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Membership } from "./models/membership";
import { User } from "./models/user";
import { Workspace } from "./models/workspace";
import { ApiError } from "./api";
import type { MembershipRole } from "./constants";

export interface WorkspaceContext { userId: string; workspaceId: string; role: MembershipRole }

export async function requireWorkspaceSession(): Promise<WorkspaceContext> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !/^[a-f0-9]{24}$/i.test(session.user.id)) {
    throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.");
  }
  await connectToDatabase();
  const user = await User.findOne({ _id: session.user.id, status: "ACTIVE", emailVerifiedAt: { $ne: null } }).select("_id").lean();
  if (!user) throw new ApiError(403, "FORBIDDEN", "An active, verified account is required.");
  const workspaceId = session.user.workspaceId;
  if (workspaceId && !/^[a-f0-9]{24}$/i.test(workspaceId)) throw new ApiError(403, "FORBIDDEN", "Workspace access is unavailable.");
  const membership = await Membership.findOne({ userId: user._id, status: "ACTIVE", ...(workspaceId ? { workspaceId } : {}) }).sort({ joinedAt: 1 }).lean();
  if (!membership || !await Workspace.exists({ _id: membership.workspaceId })) {
    throw new ApiError(403, "FORBIDDEN", "Active workspace membership is required.");
  }
  return { userId: user._id.toString(), workspaceId: membership.workspaceId.toString(), role: membership.role };
}

export function requireManager(context: WorkspaceContext) {
  if (context.role === "MEMBER") throw new ApiError(403, "FORBIDDEN", "Workspace owner or administrator access is required.");
}
