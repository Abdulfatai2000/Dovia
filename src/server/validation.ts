import { ApiError } from "./api";
export function invalid(field: string): never { throw new ApiError(400, "INVALID_INPUT", "Invalid " + field + "."); }
export function objectId(value: unknown, field = "ID"): string {
  if (typeof value !== "string" || !/^[a-f0-9]{24}$/i.test(value)) return invalid(field);
  return value.toLowerCase();
}
export function text(value: unknown, field: string, max = 500, required = false): string {
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) return invalid(field);
  return value.trim();
}
export function choice<T extends string>(value: unknown, values: readonly T[], field: string): T {
  if (typeof value !== "string" || !values.includes(value as T)) return invalid(field);
  return value as T;
}
export function date(value: unknown, field: string): Date {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value) || !Number.isFinite(Date.parse(value))) return invalid(field);
  const result = new Date(value);
  if (result.toISOString().slice(0, 10) !== value.slice(0, 10)) return invalid(field);
  return result;
}
export function integer(value: unknown, field: string, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) return invalid(field);
  return value;
}
export function ids(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.length > 100) return invalid(field);
  return [...new Set(value.map(item => objectId(item, field)))];
}
export function only(body: Record<string, unknown>, keys: readonly string[]) {
  if (Object.keys(body).some(key => !keys.includes(key))) invalid("request fields");
}
export function pagination(query: URLSearchParams) {
  const page = integer(Number(query.get("page") ?? 1), "page", 1, 10000);
  const limit = integer(Number(query.get("limit") ?? 25), "limit", 1, 100);
  return { page, limit, skip: (page - 1) * limit };
}
export function searchPattern(value: string) { return text(value, "search", 120).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
