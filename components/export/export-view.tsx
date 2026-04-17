"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"

import { ExportCriteriaPanel } from "@/components/export/export-criteria-panel"
import { ExportFormatPicker } from "@/components/export/export-format-picker"
import { exportTravelsToCsv } from "@/lib/exports/travels-csv"
import { exportTravelsToPdf } from "@/lib/exports/travels-pdf"
import { exportTravelsToXlsx } from "@/lib/exports/travels-xlsx"
import { useTravels } from "@/hooks/use-travels"
import {
  type ExportCriteria,
  type ExportFormat,
  DEFAULT_EXPORT_CRITERIA,
} from "@/lib/types/export.types"
import type { TravelRow, TravelsSummary } from "@/lib/types/travels.types"

// ── Pure helpers ──────────────────────────────────────────────────────────────

function deriveDimensions(rows: TravelRow[]): {
  departments: string[]
  zones: string[]
} {
  const departments = Array.from(
    new Set(
      rows
        .map((r) => r.travelerDepartment)
        .filter((d): d is string => d !== null),
    ),
  ).sort()

  const zones = Array.from(
    new Set(rows.map((r) => r.destinationRegion)),
  ).sort()

  return { departments, zones }
}

function applyExportCriteria(
  rows: TravelRow[],
  criteria: ExportCriteria,
): TravelRow[] {
  return rows.filter((row) => {
    const startOk =
      criteria.startDate === "" || row.startDate >= criteria.startDate
    const endOk = criteria.endDate === "" || row.endDate <= criteria.endDate
    const deptOk =
      criteria.department === "ALL" ||
      row.travelerDepartment === criteria.department
    const zoneOk =
      criteria.zone === "ALL" ||
      row.destinationRegion
        .toLowerCase()
        .includes(criteria.zone.toLowerCase())
    const purposeOk =
      criteria.purpose === "" ||
      row.travelReason
        .toLowerCase()
        .includes(criteria.purpose.toLowerCase())
    const statusOk =
      criteria.status === "ALL" || row.status === criteria.status

    return startOk && endOk && deptOk && zoneOk && purposeOk && statusOk
  })
}

function computeSummary(rows: TravelRow[]): TravelsSummary {
  const totalDeposited = rows.reduce(
    (sum, r) => sum + parseFloat(r.depositAmount ?? "0"),
    0,
  )
  const totalProven = rows.reduce(
    (sum, r) => sum + parseFloat(r.provenAmount ?? "0"),
    0,
  )
  return {
    totalRequests: rows.length,
    totalDeposited,
    totalProven,
    balance: totalDeposited - totalProven,
  }
}

function buildFilename(format: ExportFormat): string {
  const date = new Date().toISOString().split("T")[0]
  const extensions: Record<ExportFormat, string> = {
    pdf: ".pdf",
    xlsx: ".xlsx",
    csv: ".csv",
  }
  return `viajes-${date}${extensions[format]}`
}

async function triggerExport(
  format: ExportFormat,
  rows: TravelRow[],
): Promise<void> {
  const filename = buildFilename(format)
  const summary = computeSummary(rows)

  switch (format) {
    case "pdf":
      exportTravelsToPdf(rows)
      break
    case "xlsx":
      exportTravelsToXlsx(rows, summary, filename)
      break
    case "csv":
      exportTravelsToCsv(rows, filename)
      break
  }
}

// ── ExportView ────────────────────────────────────────────────────────────────

export function ExportView() {
  const { data: allRows = [], isPending, isError } = useTravels()

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(
    null,
  )
  const [criteria, setCriteria] =
    useState<ExportCriteria>(DEFAULT_EXPORT_CRITERIA)
  const [isGenerating, setIsGenerating] = useState(false)

  const { departments, zones } = useMemo(
    () => deriveDimensions(allRows),
    [allRows],
  )

  const filteredRows = useMemo(
    () => applyExportCriteria(allRows, criteria),
    [allRows, criteria],
  )

  const handleGenerate = async () => {
    if (!selectedFormat || filteredRows.length === 0) return

    setIsGenerating(true)
    try {
      await triggerExport(selectedFormat, filteredRows)
      toast.success("Exportación generada correctamente")
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Error al generar la exportación",
      )
    } finally {
      setIsGenerating(false)
    }
  }

  if (isError) {
    return (
      <p className="py-12 text-center text-sm text-destructive">
        No se pudieron cargar las solicitudes. Intenta de nuevo más tarde.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
      <ExportFormatPicker
        selectedFormat={selectedFormat}
        matchCount={filteredRows.length}
        isGenerating={isGenerating}
        isDisabled={isPending}
        onFormatChange={setSelectedFormat}
        onGenerate={handleGenerate}
      />

      <ExportCriteriaPanel
        criteria={criteria}
        departments={departments}
        zones={zones}
        totalCount={allRows.length}
        filteredCount={filteredRows.length}
        isLoading={isPending}
        onCriteriaChange={setCriteria}
      />
    </div>
  )
}
