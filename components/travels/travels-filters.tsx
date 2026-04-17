"use client"

import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TravelsFilters, StatusFilter } from "@/lib/types/travels.types"

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Todos los estados" },
  { value: "PENDING", label: "Pendiente" },
  { value: "APPROVED", label: "Aprobado" },
  { value: "PROVEN", label: "Comprobado" },
  { value: "COMPLETED", label: "Completado" },
  { value: "REJECTED", label: "Rechazado" },
]

const DEFAULT_FILTERS: TravelsFilters = { search: "", status: "ALL" }

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasActiveFilters(filters: TravelsFilters): boolean {
  return filters.search !== "" || filters.status !== "ALL"
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface TravelsFiltersProps {
  filters: TravelsFilters
  totalCount: number
  filteredCount: number
  onFiltersChange: (filters: TravelsFilters) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TravelsFilters({
  filters,
  totalCount,
  filteredCount,
  onFiltersChange,
}: Readonly<TravelsFiltersProps>) {
  const isFiltered = hasActiveFilters(filters)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onFiltersChange({ ...filters, search: e.target.value })

  const handleStatusChange = (value: string | null) =>
    onFiltersChange({ ...filters, status: (value ?? "ALL") as StatusFilter })

  const handleReset = () => onFiltersChange(DEFAULT_FILTERS)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left: inputs */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por viajero o destino..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-64 pl-8"
          />
        </div>

        {/* Status filter */}
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset button — visible only when filters are active */}
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <XIcon className="size-3.5" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Right: result count */}
      <span className="text-xs text-muted-foreground">
        {isFiltered
          ? `${filteredCount} de ${totalCount} solicitudes`
          : `${totalCount} solicitudes en total`}
      </span>
    </div>
  )
}
