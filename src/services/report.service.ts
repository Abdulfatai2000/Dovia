import { apiFetch } from "@/lib/api-client";
import { reportWindow, type calculateReport, type ReportRange } from "@/lib/report-calculations";
export { reportRanges, reportWindow } from "@/lib/report-calculations";
export type { ReportRange } from "@/lib/report-calculations";
export function getReport(range:ReportRange){const {start,end}=reportWindow(range);return apiFetch<ReturnType<typeof calculateReport>>("/api/reports?"+new URLSearchParams({range,from:start,to:end}));}
