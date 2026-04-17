import * as XLSX from "xlsx"

import type { TravelRow, TravelRequestStatus, TravelsSummary } from "@/lib/types/travels.types"

// ── Colour palette ────────────────────────────────────────────────────────────

const C = {
  black:       "000000",
  darkSurface: "111827",
  midSurface:  "1F2937",
  border:      "D1D5DB",
  rowEven:     "F9FAFB",
  rowOdd:      "FFFFFF",
  mutedText:   "6B7280",
  bodyText:    "111827",
  white:       "FFFFFF",
  summaryBg:   "F3F4F6",

  // Status badge colours
  status: {
    PENDING:   { bg: "FFFBEB", text: "92400E" },
    APPROVED:  { bg: "ECFDF5", text: "065F46" },
    PROVEN:    { bg: "EFF6FF", text: "1E40AF" },
    COMPLETED: { bg: "F0FDF4", text: "14532D" },
    REJECTED:  { bg: "FEF2F2", text: "991B1B" },
  } satisfies Record<TravelRequestStatus, { bg: string; text: string }>,
} as const

// ── Localised labels ──────────────────────────────────────────────────────────

const STATUS_LABELS: Record<TravelRequestStatus, string> = {
  PENDING:   "Pendiente",
  APPROVED:  "Aprobado",
  PROVEN:    "Comprobado",
  COMPLETED: "Completado",
  REJECTED:  "Rechazado",
}

// ── Column manifest ───────────────────────────────────────────────────────────

const COLUMNS = [
  { header: "Viajero",            wch: 28 },
  { header: "Departamento",       wch: 20 },
  { header: "Destino",            wch: 20 },
  { header: "Propósito",          wch: 40 },
  { header: "Fecha inicio",       wch: 14 },
  { header: "Fecha fin",          wch: 14 },
  { header: "Días",               wch:  7 },
  { header: "Estado",             wch: 14 },
  { header: "Depositado (MXN)",   wch: 20 },
  { header: "Comprobado (MXN)",   wch: 20 },
] as const

const COL_COUNT  = COLUMNS.length          // 10
const LAST_COL   = COL_COUNT - 1           // col index J
const MXN_FORMAT = '"$"#,##0.00'

// ── CellStyle alias ───────────────────────────────────────────────────────────
// xlsx does not export a public CellStyle type in community edition,
// so we define a minimal local alias that matches what xlsx actually accepts.

type BorderSide  = { style: string; color: { rgb: string } }
type CellStyle = {
  font?:      { bold?: boolean; color?: { rgb: string }; sz?: number; name?: string }
  fill?:      { patternType: "solid"; fgColor: { rgb: string } }
  alignment?: { horizontal?: "left" | "center" | "right"; vertical?: "center"; wrapText?: boolean }
  border?:    { top?: BorderSide; bottom?: BorderSide; left?: BorderSide; right?: BorderSide }
}

// ── Style factories ───────────────────────────────────────────────────────────

function fill(rgb: string): CellStyle["fill"] {
  return { patternType: "solid", fgColor: { rgb } }
}

function border(rgb: string = C.border): CellStyle["border"] {
  const side: BorderSide = { style: "thin", color: { rgb } }
  return { top: side, bottom: side, left: side, right: side }
}

const titleStyle: CellStyle = {
  font:      { bold: true, color: { rgb: C.white }, sz: 15, name: "Arial" },
  fill:      fill(C.black),
  alignment: { horizontal: "center", vertical: "center" },
}

const subtitleStyle: CellStyle = {
  font:      { color: { rgb: "9CA3AF" }, sz: 9, name: "Arial" },
  fill:      fill(C.darkSurface),
  alignment: { horizontal: "center", vertical: "center" },
}

const headerStyle: CellStyle = {
  font:      { bold: true, color: { rgb: C.white }, sz: 10, name: "Arial" },
  fill:      fill(C.midSurface),
  alignment: { horizontal: "center", vertical: "center" },
  border:    border("374151"),
}

function dataCellStyle(
  isEven: boolean,
  align: "left" | "center" | "right" = "left",
  wrap = false,
): CellStyle {
  return {
    font:      { color: { rgb: C.bodyText }, sz: 10, name: "Arial" },
    fill:      fill(isEven ? C.rowEven : C.rowOdd),
    alignment: { horizontal: align, vertical: "center", wrapText: wrap },
    border:    border(),
  }
}

function statusCellStyle(status: TravelRequestStatus): CellStyle {
  const { bg, text } = C.status[status]
  return {
    font:      { bold: true, color: { rgb: text }, sz: 9, name: "Arial" },
    fill:      fill(bg),
    alignment: { horizontal: "center", vertical: "center" },
    border:    border(),
  }
}

const summaryBarStyle: CellStyle = {
  font:      { bold: true, color: { rgb: C.white }, sz: 11, name: "Arial" },
  fill:      fill(C.black),
  alignment: { horizontal: "center", vertical: "center" },
}

const summaryLabelStyle: CellStyle = {
  font:      { color: { rgb: C.mutedText }, sz: 8, name: "Arial" },
  fill:      fill(C.summaryBg),
  alignment: { horizontal: "center", vertical: "center" },
  border:    border(),
}

const summaryValueStyle: CellStyle = {
  font:      { bold: true, color: { rgb: C.black }, sz: 13, name: "Arial" },
  fill:      fill(C.white),
  alignment: { horizontal: "center", vertical: "center" },
  border:    border(),
}

// ── Low-level cell writer ─────────────────────────────────────────────────────

type CellType = "s" | "n" | "b"

interface WriteCellOpts {
  style?: CellStyle
  numFmt?: string
}

function writeCell(
  ws: XLSX.WorkSheet,
  r: number,
  c: number,
  value: string | number | boolean,
  t: CellType,
  opts: WriteCellOpts = {},
): void {
  const ref = XLSX.utils.encode_cell({ r, c })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cell: any = { v: value, t }
  if (opts.style) cell.s = opts.style
  if (opts.numFmt) cell.z = opts.numFmt
  ws[ref] = cell
}

/** Fill an entire row with an empty styled cell (so merged regions render uniformly). */
function fillRowStyle(ws: XLSX.WorkSheet, r: number, style: CellStyle): void {
  for (let c = 0; c < COL_COUNT; c++) {
    const ref = XLSX.utils.encode_cell({ r, c })
    if (!ws[ref]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ws[ref] = { v: "", t: "s", s: style }
    }
  }
}

/** Fill a contiguous range with a background style (used for empty cells in merged areas). */
function fillRangeStyle(
  ws: XLSX.WorkSheet,
  r: number,
  cStart: number,
  cEnd: number,
  style: CellStyle,
): void {
  for (let c = cStart; c <= cEnd; c++) {
    const ref = XLSX.utils.encode_cell({ r, c })
    if (!ws[ref]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ws[ref] = { v: "", t: "s", s: style }
    }
  }
}

// ── Workbook builder ──────────────────────────────────────────────────────────

export function buildTravelsWorkbook(
  rows: TravelRow[],
  summary: TravelsSummary,
): XLSX.WorkBook {
  const ws: XLSX.WorkSheet = {}
  const merges: XLSX.Range[] = []

  let r = 0 // current row index (0-based)

  // ── Helper: full-width merge ────────────────────────────────────────────────
  function mergeFullRow(row: number): void {
    merges.push({ s: { r: row, c: 0 }, e: { r: row, c: LAST_COL } })
  }

  // ── Helper: partial merge ───────────────────────────────────────────────────
  function mergeRange(row: number, c1: number, c2: number): void {
    if (c2 > c1) merges.push({ s: { r: row, c: c1 }, e: { r: row, c: c2 } })
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ROW 0 — Report title
  // ══════════════════════════════════════════════════════════════════════════
  writeCell(ws, r, 0, "CONTROL DE SOLICITUDES DE VIAJE Y VIÁTICOS", "s", { style: titleStyle })
  fillRowStyle(ws, r, titleStyle)
  mergeFullRow(r)
  r++

  // ══════════════════════════════════════════════════════════════════════════
  // ROW 1 — Subtitle (generated date + record count)
  // ══════════════════════════════════════════════════════════════════════════
  const dateStr = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const subtitle = `Generado el ${dateStr}  ·  ${rows.length} solicitudes exportadas`
  writeCell(ws, r, 0, subtitle, "s", { style: subtitleStyle })
  fillRowStyle(ws, r, subtitleStyle)
  mergeFullRow(r)
  r++

  // ══════════════════════════════════════════════════════════════════════════
  // ROW 2 — Spacer
  // ══════════════════════════════════════════════════════════════════════════
  r++

  // ══════════════════════════════════════════════════════════════════════════
  // ROW 3 — Column headers
  // ══════════════════════════════════════════════════════════════════════════
  const headerRow = r
  COLUMNS.forEach((col, c) => {
    writeCell(ws, r, c, col.header, "s", { style: headerStyle })
  })
  r++

  // ══════════════════════════════════════════════════════════════════════════
  // ROWS 4 + — Data
  // ══════════════════════════════════════════════════════════════════════════
  rows.forEach((row, idx) => {
    const even = idx % 2 === 0

    writeCell(ws, r, 0, row.travelerName,            "s", { style: dataCellStyle(even) })
    writeCell(ws, r, 1, row.travelerDepartment ?? "—","s", { style: dataCellStyle(even) })
    writeCell(ws, r, 2, row.destinationRegion,       "s", { style: dataCellStyle(even) })
    writeCell(ws, r, 3, row.travelReason,            "s", { style: dataCellStyle(even, "left", true) })
    writeCell(ws, r, 4, row.startDate,               "s", { style: dataCellStyle(even, "center") })
    writeCell(ws, r, 5, row.endDate,                 "s", { style: dataCellStyle(even, "center") })
    writeCell(ws, r, 6, row.days ?? 0,               "n", { style: dataCellStyle(even, "center") })
    writeCell(ws, r, 7, STATUS_LABELS[row.status],   "s", { style: statusCellStyle(row.status) })
    writeCell(ws, r, 8, parseFloat(row.depositAmount ?? "0"), "n", {
      style:  dataCellStyle(even, "right"),
      numFmt: MXN_FORMAT,
    })
    writeCell(ws, r, 9, parseFloat(row.provenAmount ?? "0"), "n", {
      style:  dataCellStyle(even, "right"),
      numFmt: MXN_FORMAT,
    })

    r++
  })

  // ══════════════════════════════════════════════════════════════════════════
  // Spacer before summary
  // ══════════════════════════════════════════════════════════════════════════
  r++

  // ══════════════════════════════════════════════════════════════════════════
  // Summary section
  // ══════════════════════════════════════════════════════════════════════════

  // ── Summary bar ────────────────────────────────────────────────────────────
  writeCell(ws, r, 0, "RESUMEN FINANCIERO", "s", { style: summaryBarStyle })
  fillRowStyle(ws, r, summaryBarStyle)
  mergeFullRow(r)
  r++

  // ── Summary: 4-box layout ──────────────────────────────────────────────────
  // Box column assignments (each box spans 2–3 columns):
  //   Box 0  Solicitudes   → cols 0–1   (A:B)
  //   Box 1  Depositado    → cols 2–4   (C:E)
  //   Box 2  Comprobado    → cols 5–7   (F:H)
  //   Box 3  Balance neto  → cols 8–9   (I:J)

  const BOXES = [
    { label: "SOLICITUDES",            value: summary.totalRequests,    isCurrency: false, c1: 0, c2: 1 },
    { label: "TOTAL DEPOSITADO (MXN)", value: summary.totalDeposited,   isCurrency: true,  c1: 2, c2: 4 },
    { label: "TOTAL COMPROBADO (MXN)", value: summary.totalProven,      isCurrency: true,  c1: 5, c2: 7 },
    { label: "BALANCE NETO (MXN)",     value: summary.balance,          isCurrency: true,  c1: 8, c2: 9 },
  ] as const

  const labelRow = r
  const valueRow = r + 1

  BOXES.forEach(({ label, value, isCurrency, c1, c2 }) => {
    // Label cell
    writeCell(ws, labelRow, c1, label, "s", { style: summaryLabelStyle })
    fillRangeStyle(ws, labelRow, c1 + 1, c2, summaryLabelStyle)
    mergeRange(labelRow, c1, c2)

    // Value cell
    writeCell(ws, valueRow, c1, value, "n", {
      style:  summaryValueStyle,
      numFmt: isCurrency ? MXN_FORMAT : "0",
    })
    fillRangeStyle(ws, valueRow, c1 + 1, c2, summaryValueStyle)
    mergeRange(valueRow, c1, c2)
  })

  r += 2

  // ══════════════════════════════════════════════════════════════════════════
  // Sheet metadata
  // ══════════════════════════════════════════════════════════════════════════

  ws["!ref"] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r - 1, c: LAST_COL } })

  ws["!cols"] = COLUMNS.map(({ wch }) => ({ wch }))

  // Row heights (hpt = height in points)
  const rowHeights: XLSX.RowInfo[] = new Array(r).fill({ hpt: 20 })
  rowHeights[0]         = { hpt: 38 } // title
  rowHeights[1]         = { hpt: 16 } // subtitle
  rowHeights[2]         = { hpt:  8 } // spacer
  rowHeights[headerRow] = { hpt: 24 } // headers
  rowHeights[labelRow]  = { hpt: 18 } // summary labels
  rowHeights[valueRow]  = { hpt: 34 } // summary values (bigger font)
  ws["!rows"] = rowHeights

  ws["!merges"] = merges

  // Freeze the header row so it stays visible while scrolling
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(ws as any)["!freeze"] = { xSplit: 0, ySplit: headerRow + 1 }

  // ══════════════════════════════════════════════════════════════════════════
  // Assemble workbook
  // ══════════════════════════════════════════════════════════════════════════
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Viajes")

  return wb
}

// ── Browser download ──────────────────────────────────────────────────────────

/**
 * Serialises the workbook to a binary string, converts it to a Uint8Array,
 * and triggers a browser file-download.  Using `type: "binary"` is the most
 * reliable approach across browsers and avoids Node-only Buffer polyfills.
 */
export function exportTravelsToXlsx(
  rows: TravelRow[],
  summary: TravelsSummary,
  filename = "solicitudes-viaje.xlsx",
): void {
  const wb      = buildTravelsWorkbook(rows, summary)
  const bstr    = XLSX.write(wb, { bookType: "xlsx", type: "binary" }) as string
  const bytes   = new Uint8Array(bstr.length)
  for (let i = 0; i < bstr.length; i++) {
    bytes[i] = bstr.charCodeAt(i) & 0xff
  }

  const blob   = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url    = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href     = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
