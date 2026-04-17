"use client"

import {
  CheckFatIcon,
  ExportIcon,
  FileCsvIcon,
  FilePdfIcon,
  FileXlsIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { IconWeight } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import type { ExportFormat } from "@/lib/types/export.types"
import { cn } from "@/lib/utils"

// ── Format manifest ───────────────────────────────────────────────────────────

type IconComponent = React.ComponentType<{
  className?: string
  weight?: IconWeight
}>

type FormatConfig = {
  readonly id: ExportFormat
  readonly label: string
  readonly description: string
  readonly icon: IconComponent
}

const EXPORT_FORMATS: readonly FormatConfig[] = [
  {
    id: "pdf",
    label: "Informe PDF",
    description: "Reporte visual listo para imprimir o compartir digitalmente",
    icon: FilePdfIcon,
  },
  {
    id: "xlsx",
    label: "Hoja de cálculo",
    description: "Archivo Excel con formato avanzado y resumen financiero",
    icon: FileXlsIcon,
  },
  {
    id: "csv",
    label: "Datos CSV",
    description: "Formato universal compatible con cualquier herramienta de análisis",
    icon: FileCsvIcon,
  },
] as const

// ── FormatCard ────────────────────────────────────────────────────────────────

interface FormatCardProps {
  config: FormatConfig
  isSelected: boolean
  isDisabled: boolean
  onClick: () => void
}

function FormatCard({
  config,
  isSelected,
  isDisabled,
  onClick,
}: Readonly<FormatCardProps>) {
  const Icon = config.icon

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 p-3 text-left transition-colors ring-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isSelected
          ? "bg-foreground text-background ring-foreground"
          : "bg-card ring-border hover:bg-muted",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          isSelected ? "text-background" : "text-muted-foreground",
        )}
        weight="duotone"
      />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-xs font-semibold",
            isSelected ? "text-background" : "text-foreground",
          )}
        >
          {config.label}
        </p>
        <p
          className={cn(
            "mt-0.5 text-xs leading-snug",
            isSelected ? "text-background/70" : "text-muted-foreground",
          )}
        >
          {config.description}
        </p>
      </div>

      {isSelected && (
        <CheckFatIcon
          className="size-3.5 shrink-0 text-background"
          weight="fill"
        />
      )}
    </button>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveButtonLabel(
  selectedFormat: ExportFormat | null,
  isGenerating: boolean,
): string {
  if (isGenerating) return "Generando..."
  if (!selectedFormat) return "Generar exportación"
  const config = EXPORT_FORMATS.find((f) => f.id === selectedFormat)
  return config ? `Exportar ${config.label}` : "Generar exportación"
}

function resolveMatchLabel(matchCount: number, isDisabled: boolean): string {
  if (isDisabled) return "Cargando datos..."
  if (matchCount === 0) return "Sin datos para exportar"
  if (matchCount === 1) return "1 solicitud lista para exportar"
  return `${matchCount} solicitudes listas para exportar`
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ExportFormatPickerProps {
  selectedFormat: ExportFormat | null
  matchCount: number
  isGenerating: boolean
  isDisabled: boolean
  onFormatChange: (format: ExportFormat) => void
  onGenerate: () => void
}

// ── ExportFormatPicker ────────────────────────────────────────────────────────

export function ExportFormatPicker({
  selectedFormat,
  matchCount,
  isGenerating,
  isDisabled,
  onFormatChange,
  onGenerate,
}: Readonly<ExportFormatPickerProps>) {
  const canGenerate =
    selectedFormat !== null && matchCount > 0 && !isDisabled && !isGenerating

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Formato de exportación
        </CardTitle>
        <CardDescription>
          Selecciona el tipo de archivo a generar
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {EXPORT_FORMATS.map((format) => (
          <FormatCard
            key={format.id}
            config={format}
            isSelected={selectedFormat === format.id}
            isDisabled={isGenerating}
            onClick={() => onFormatChange(format.id)}
          />
        ))}
      </CardContent>

      <CardFooter className="mt-auto flex-col items-stretch gap-3 border-t p-4">
        <Separator className="hidden" />

        <p className="text-center text-xs text-muted-foreground">
          {resolveMatchLabel(matchCount, isDisabled)}
        </p>

        <Button
          className="w-full"
          onClick={onGenerate}
          disabled={!canGenerate}
        >
          {isGenerating ? (
            <Spinner className="size-4" />
          ) : (
            <ExportIcon className="size-4" />
          )}
          {resolveButtonLabel(selectedFormat, isGenerating)}
        </Button>
      </CardFooter>
    </Card>
  )
}
