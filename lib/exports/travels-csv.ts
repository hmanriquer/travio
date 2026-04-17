import type { TravelRequestStatus, TravelRow } from "@/lib/types/travels.types"

// ── Localised status labels ───────────────────────────────────────────────────

const STATUS_LABELS: Record<TravelRequestStatus, string> = {
  PENDING:   "Pendiente",
  APPROVED:  "Aprobado",
  PROVEN:    "Comprobado",
  COMPLETED: "Completado",
  REJECTED:  "Rechazado",
}

// ── Column headers ────────────────────────────────────────────────────────────

const HEADERS = [
  "Viajero",
  "Departamento",
  "Destino",
  "Propósito",
  "Fecha inicio",
  "Fecha fin",
  "Días",
  "Estado",
  "Depositado (MXN)",
  "Comprobado (MXN)",
]

// ── Row mapper ────────────────────────────────────────────────────────────────

function toRowValues(row: TravelRow): string[] {
  return [
    row.travelerName,
    row.travelerDepartment ?? "",
    row.destinationRegion,
    row.travelReason,
    row.startDate,
    row.endDate,
    String(row.days ?? ""),
    STATUS_LABELS[row.status],
    row.depositAmount ?? "0",
    row.provenAmount ?? "0",
  ]
}

// ── Cell escaper ──────────────────────────────────────────────────────────────

/**
 * Wraps a cell value in double-quotes and escapes any internal double-quotes
 * by doubling them, following RFC 4180.
 */
function escapeCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}

// ── Download helper ───────────────────────────────────────────────────────────

function triggerDownload(content: string, filename: string, mimeType: string): void {
  const blob   = new Blob([content], { type: mimeType })
  const url    = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href     = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Serialises `rows` to a UTF-8 CSV string and triggers a browser file-download.
 *
 * A UTF-8 BOM (\uFEFF) is prepended so that Excel opens the file with the
 * correct encoding without requiring the user to go through the import wizard.
 */
export function exportTravelsToCsv(
  rows: TravelRow[],
  filename = "viajes.csv",
): void {
  const lines = [HEADERS, ...rows.map(toRowValues)]
    .map((row) => row.map(escapeCell).join(","))
    .join("\n")

  triggerDownload(
    "\uFEFF" + lines,
    filename,
    "text/csv;charset=utf-8;",
  )
}
