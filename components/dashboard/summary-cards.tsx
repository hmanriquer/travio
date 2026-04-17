"use client"

import type { IconWeight } from "@phosphor-icons/react"
import {
  CoinsIcon,
  PiggyBankIcon,
  ReceiptIcon,
} from "@phosphor-icons/react/dist/ssr"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardSummary } from "@/hooks/use-dashboard-summary"
import type { DashboardSummary } from "@/lib/types/dashboard.types"
import { formatCurrency } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────────

type SummaryCardData = {
  title: string
  value: string
  secondaryLabel: string
  icon: React.ComponentType<{ className?: string; weight?: IconWeight }>
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildSummaryCards(summary: DashboardSummary): SummaryCardData[] {
  return [
    {
      title: "Total depositado",
      value: formatCurrency(summary.totalDeposited),
      secondaryLabel: `${summary.activeCount} solicitudes activas`,
      icon: PiggyBankIcon,
    },
    {
      title: "Gastos actuales",
      value: formatCurrency(summary.totalProven),
      secondaryLabel: `${summary.pendingCount} por comprobar`,
      icon: ReceiptIcon,
    },
    {
      title: "Balance neto",
      value: formatCurrency(summary.netBalance),
      secondaryLabel: `${summary.completedCount} completadas`,
      icon: CoinsIcon,
    },
  ]
}

// ── Sub-components ─────────────────────────────────────────────────────────────

type SummaryCardProps = {
  data: SummaryCardData
}

function SummaryCard({ data }: Readonly<SummaryCardProps>) {
  const { title, value, secondaryLabel, icon: Icon } = data

  return (
    <Card className="hover-lift flex-1">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          {title}
        </CardTitle>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" weight="duotone" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-black tracking-tight tabular-nums text-foreground">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground font-medium">{secondaryLabel}</p>
      </CardContent>
    </Card>
  )
}

function SummaryCardsSkeleton() {
  return (
    <section
      aria-label="Resumen financiero"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-28" />
            <Skeleton className="mt-2 h-3 w-40" />
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

// ── SummaryCards ───────────────────────────────────────────────────────────────

export function SummaryCards() {
  const { data: summary, isPending, isError } = useDashboardSummary()

  if (isPending) return <SummaryCardsSkeleton />

  if (isError || !summary) {
    return (
      <p className="text-sm text-destructive">
        Error al cargar el resumen financiero.
      </p>
    )
  }

  const cards = buildSummaryCards(summary)

  return (
    <section
      aria-label="Resumen financiero"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {cards.map((card) => (
        <SummaryCard key={card.title} data={card} />
      ))}
    </section>
  )
}
