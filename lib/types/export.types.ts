import type { TravelRequestStatus } from "./dashboard.types"

// ── Export Format ─────────────────────────────────────────────────────────────

export type ExportFormat = "pdf" | "xlsx" | "csv"

// ── Export Criteria ───────────────────────────────────────────────────────────

/**
 * All fields are optional / use sentinel values so that an empty criteria
 * object means "no filter applied — include everything".
 *
 * - `startDate` / `endDate`: ISO date strings (YYYY-MM-DD), empty string = no limit
 * - `department` / `zone`:   "ALL" = no filter, any other string = exact / substring match
 * - `purpose`:               free-text substring filter on travelReason, empty = no filter
 * - `status`:                "ALL" = no filter, any TravelRequestStatus = exact match
 */
export type ExportCriteria = {
  startDate: string
  endDate: string
  department: string
  zone: string
  purpose: string
  status: TravelRequestStatus | "ALL"
}

export const DEFAULT_EXPORT_CRITERIA: ExportCriteria = {
  startDate: "",
  endDate: "",
  department: "ALL",
  zone: "ALL",
  purpose: "",
  status: "ALL",
}
