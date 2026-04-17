"use client"

import { useMemo, useState } from "react"

import { TravelsFilters as TravelsFiltersBar } from "@/components/travels/travels-filters"
import { TravelsSummaryCard } from "@/components/travels/travels-summary"
import { TravelsTable } from "@/components/travels/travels-table"
import { useTravels } from "@/hooks/use-travels"
import type {
  TravelRow,
  TravelsFilters,
  TravelsSummary,
} from "@/lib/types/travels.types"

// ── Helpers ───────────────────────────────────────────────────────────────────

function applyFilters(rows: TravelRow[], filters: TravelsFilters): TravelRow[] {
  return rows.filter((row) => {
    const searchTerm = filters.search.toLowerCase()
    const matchesSearch =
      searchTerm === "" ||
      row.travelerName.toLowerCase().includes(searchTerm) ||
      row.destinationRegion.toLowerCase().includes(searchTerm)

    const matchesStatus =
      filters.status === "ALL" || row.status === filters.status

    return matchesSearch && matchesStatus
  })
}

function computeSummary(rows: TravelRow[]): TravelsSummary {
  const totalDeposited = rows.reduce(
    (sum, row) => sum + parseFloat(row.depositAmount ?? "0"),
    0
  )
  const totalProven = rows.reduce(
    (sum, row) => sum + parseFloat(row.provenAmount ?? "0"),
    0
  )

  return {
    totalRequests: rows.length,
    totalDeposited,
    totalProven,
    balance: totalDeposited - totalProven,
  }
}

const DEFAULT_FILTERS: TravelsFilters = { search: "", status: "ALL" }

// ── TravelsView ───────────────────────────────────────────────────────────────

export function TravelsView() {
  const { data: allRows = [], isPending, isError } = useTravels()
  const [filters, setFilters] = useState<TravelsFilters>(DEFAULT_FILTERS)

  const filteredRows = useMemo(
    () => applyFilters(allRows, filters),
    [allRows, filters]
  )

  const summary = useMemo(() => computeSummary(filteredRows), [filteredRows])

  const hasFilters = filters.search !== "" || filters.status !== "ALL"

  if (isError) {
    return (
      <p className="py-12 text-center text-sm text-destructive">
        Error al cargar las solicitudes de viaje. Intenta de nuevo.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <TravelsFiltersBar
        filters={filters}
        totalCount={allRows.length}
        filteredCount={filteredRows.length}
        onFiltersChange={setFilters}
      />

      <TravelsTable
        rows={filteredRows}
        isLoading={isPending}
        hasFilters={hasFilters}
      />

      <TravelsSummaryCard summary={summary} rows={filteredRows} />
    </div>
  )
}
