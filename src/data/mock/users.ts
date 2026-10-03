import type { UserProfile } from "@/types/auth";

export interface DemoUser extends UserProfile { role: string; }
export const users: DemoUser[] = [
  { id: "user-abdulfatai", name: "Abdulfatai", email: "abdulfatai@example.com", role: "Product Lead" },
  { id: "user-sarah", name: "Sarah Chen", email: "sarah@example.com", role: "Product Manager" },
  { id: "user-marcus", name: "Marcus Lee", email: "marcus@example.com", role: "UX Designer" },
  { id: "user-priya", name: "Priya Shah", email: "priya@example.com", role: "Project Manager" },
  { id: "user-daniel", name: "Daniel Kim", email: "daniel@example.com", role: "Software Engineer" },
  { id: "user-david", name: "David Liu", email: "david@example.com", role: "Data Analyst" },
  { id: "user-emily", name: "Emily Rodriguez", email: "emily@example.com", role: "Customer Success" },
];
export const getUser = (id: string) => users.find(user => user.id === id);
