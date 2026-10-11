import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

export async function api<T>(work: () => Promise<T>) {
  try {
    return NextResponse.json({ success: true, data: await work() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const known = error instanceof ApiError;
    return NextResponse.json({ success: false, error: {
      code: known ? error.code : "INTERNAL_ERROR",
      message: known ? error.message : "Unable to complete the request. Please try again.",
    } }, { status: known ? error.status : 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function jsonBody(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (text.length > 650_000) throw new ApiError(413, "PAYLOAD_TOO_LARGE", "The request is too large.");
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch { throw new ApiError(400, "INVALID_INPUT", "Send a valid JSON object."); }
}
