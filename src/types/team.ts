export type TeamRole = "OWNER" | "ADMIN" | "MEMBER";

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
}

export interface Team {
  id: string;
  workspaceId: string;
  name: string;
}
