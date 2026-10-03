import type { UserProfile } from "@/types/auth";

export interface DemoUser extends UserProfile { role: string; department: string; status: "Active" | "Away"; }
export const users: DemoUser[] = [
  { id: "user-abdulfatai", name: "Abdulfatai", email: "abdulfatai@example.com", role: "Product Lead", department: "Product", status: "Active" },
  { id: "user-sarah", name: "Sarah Chen", email: "sarah@example.com", role: "Product Manager", department: "Product", status: "Active" },
  { id: "user-marcus", name: "Marcus Lee", email: "marcus@example.com", role: "UX Designer", department: "Design", status: "Active" },
  { id: "user-priya", name: "Priya Shah", email: "priya@example.com", role: "Project Manager", department: "Operations", status: "Away" },
  { id: "user-daniel", name: "Daniel Kim", email: "daniel@example.com", role: "Software Engineer", department: "Engineering", status: "Active" },
  { id: "user-david", name: "David Liu", email: "david@example.com", role: "Data Analyst", department: "Analytics", status: "Active" },
  { id: "user-emily", name: "Emily Rodriguez", email: "emily@example.com", role: "Customer Success", department: "Customer Success", status: "Active" },
];
export const getUser = (id: string) => users.find(user => user.id === id);

