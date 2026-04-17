"use client"

import { XIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { TravelRequestStatus } from "@/lib/types/dashboard.types"
import {
  type ExportCriteria,
  DEFAULT_EXPORT_CRITERIA,
} from "@/lib/types/export.types"

// ── Status options ────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: TravelRequestStatus | "ALL"; label: string }[] =
  [
    { value: "ALL", label: "Todos los estados" },
    { value: "PENDING", label: "Pendiente" },
    { value: "APPROVED", label: "Aprobado" },
    { value: "PROVEN", label: "Comprobado" },
    { value: "COMPLETED", label: "Completado" },
    { value: "REJECTED", label: "Rechazado" },
  ]

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasActiveFilters(criteria: ExportCriteria): boolean {
  return (
    criteria.startDate !== "" ||
    criteria.endDate !== "" ||
    criteria.department !== "ALL" ||
    criteria.zone !== "ALL" ||
    criteria.purpose !== "" ||
    criteria.status !== "ALL"
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ExportCriteriaPanelProps {
  criteria: ExportCriteria
  departments: string[]
  zones: string[]
  totalCount: number
  filteredCount: number
  isLoading: boolean
  onCriteriaChange: (criteria: ExportCriteria) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ExportCriteriaPanel({
  criteria,
  departments,
  zones,
  totalCount,
  filteredCount,
  isLoading,
  onCriteriaChange,
}: Readonly<ExportCriteriaPanelProps>) {
  const isFiltered = hasActiveFilters(criteria)

  function update<K extends keyof ExportCriteria>(
    key: K,
    value: ExportCriteria[K],
  ) {
    onCriteriaChange({ ...criteria, [key]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Criterios de filtrado
        </CardTitle>
        <CardDescription>
          Aplica filtros para refinar los datos que serán incluidos en la
          exportación
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* ── Date range ─────────────────────────────────────────────────── */}
        <Field>
          <FieldLabel>Fecha inicio</FieldLabel>
          <Input
            type="date"
            value={criteria.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Fecha fin</FieldLabel>
          <Input
            type="date"
            value={criteria.endDate}
            onChange={(e) => update("endDate", e.target.value)}
          />
        </Field>

        {/* ── Department ─────────────────────────────────────────────────── */}
        <Field>
          <FieldLabel>Departamento</FieldLabel>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <Select
              value={criteria.department}
              onValueChange={(val) => update("department", val ?? "ALL")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los departamentos</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>

        {/* ── Zone / Region ──────────────────────────────────────────────── */}
        <Field>
          <FieldLabel>Zona / Región</FieldLabel>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <Select
              value={criteria.zone}
              onValueChange={(val) => update("zone", val ?? "ALL")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas las zonas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas las zonas</SelectItem>
                {zones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>

        {/* ── Status ─────────────────────────────────────────────────────── */}
        <Field>
          <FieldLabel>Estado de la solicitud</FieldLabel>
          <Select
            value={criteria.status}
            onValueChange={(val) =>
              update("status", (val ?? "ALL") as ExportCriteria["status"])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* ── Trip Purpose ───────────────────────────────────────────────── */}
        <Field>
          <FieldLabel>Propósito del viaje</FieldLabel>
          <Input
            type="text"
            placeholder="Filtrar por motivo del viaje..."
            value={criteria.purpose}
            onChange={(e) => update("purpose", e.target.value)}
          />
        </Field>
      </CardContent>

      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">
          {isLoading
            ? "Cargando datos..."
            : isFiltered
              ? `${filteredCount} de ${totalCount} solicitudes coinciden`
              : `${totalCount} solicitudes disponibles`}
        </span>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCriteriaChange(DEFAULT_EXPORT_CRITERIA)}
          >
            <XIcon className="size-3.5" />
            Limpiar filtros
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
