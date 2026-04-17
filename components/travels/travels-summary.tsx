"use client"

import { FileXlsIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { exportTravelsToXlsx } from "@/lib/exports/travels-xlsx"
import type { TravelRow, TravelsSummary } from "@/lib/types/travels.types"
import { formatCurrency } from "@/lib/utils"

// ── Sub-components ────────────────────────────────────────────────────────────

interface SummaryStatProps {
  label: string
  value: string
}

function SummaryStat({ label, value }: Readonly<SummaryStatProps>) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  )
}

// ── TravelsSummaryCard ────────────────────────────────────────────────────────

interface TravelsSummaryCardProps {
  summary: TravelsSummary
  rows: TravelRow[]
}

export function TravelsSummaryCard({
  summary,
  rows,
}: Readonly<TravelsSummaryCardProps>) {
  const handleExport = () => exportTravelsToXlsx(rows, summary)

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
        {/* Financial stats */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <SummaryStat
            label="Solicitudes"
            value={String(summary.totalRequests)}
          />
          <Separator orientation="vertical" className="hidden h-8 sm:block" />
          <SummaryStat
            label="Total depositado"
            value={formatCurrency(summary.totalDeposited)}
          />
          <Separator orientation="vertical" className="hidden h-8 sm:block" />
          <SummaryStat
            label="Total comprobado"
            value={formatCurrency(summary.totalProven)}
          />
          <Separator orientation="vertical" className="hidden h-8 sm:block" />
          <SummaryStat
            label="Balance neto"
            value={formatCurrency(summary.balance)}
          />
        </div>

        {/* Export */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={rows.length === 0}
        >
          <FileXlsIcon className="size-4" weight="duotone" />
          Exportar Excel
        </Button>
      </CardContent>
    </Card>
  )
}
