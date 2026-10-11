export const WORKSPACE_CHANGED = "dovia-workspace-changed";
export class ApiClientError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
 const response = await fetch(path, { cache: "no-store", ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
 const result = await response.json();
 if (!response.ok || !result.success) throw new ApiClientError(result.error?.message ?? "Unable to complete the request.", response.status);
 return result.data as T;
}
export async function allPages<T>(path: string): Promise<T[]> {
 const items: T[] = [];
 for (let page=1;page<=100;page++) {
  const result = await apiFetch<{items:T[];total:number}>(path + (path.includes("?") ? "&" : "?") + "limit=100&page=" + page);
  items.push(...result.items); if (items.length>=result.total || !result.items.length) return items;
 }
 throw new Error("Too many records to display. Narrow the selected range.");
}
export function changed() { window.dispatchEvent(new Event(WORKSPACE_CHANGED)); }
