"use client"

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ClockCounterClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRecentActivity } from "@/hooks/use-recent-activity"
import type {
  RecentActivityItem,
  TravelRequestStatus,
} from "@/lib/types/dashboard.types"
import { formatCurrency, formatDate } from "@/lib/utils"

// ── Maps ───────────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<
  TravelRequestStatus,
  {
    label: string
    variant: "secondary" | "outline" | "destructive" | "default"
  }
> = {
  PENDING: { label: "Pendiente", variant: "outline" },
  APPROVED: { label: "Aprobado", variant: "default" },
  PROVEN: { label: "Comprobado", variant: "secondary" },
  COMPLETED: { label: "Completado", variant: "secondary" },
  REJECTED: { label: "Rechazado", variant: "destructive" },
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface ActivityAmountProps {
  amount: string | null
}

function ActivityAmount({ amount }: Readonly<ActivityAmountProps>) {
  const parsed = parseFloat(amount ?? "0")
  const Icon = parsed >= 0 ? ArrowUpIcon : ArrowDownIcon

  return (
    <div className="flex items-center gap-1 text-sm font-semibold text-foreground tabular-nums">
      <Icon className="size-3 shrink-0 text-muted-foreground" weight="bold" />
      {amount ? formatCurrency(parsed) : "—"}
    </div>
  )
}

interface ActivityRowProps {
  item: RecentActivityItem
}

function ActivityRow({ item }: Readonly<ActivityRowProps>) {
  const { label, variant } = STATUS_MAP[item.status]

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      {/* Traveler & destination */}
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-medium">
          {item.travelerName}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {item.destinationRegion} · {formatDate(item.createdAt.split("T")[0])}
        </span>
      </div>

      {/* Amount & status */}
      <div className="flex shrink-0 items-center gap-3">
        <ActivityAmount amount={item.depositAmount} />
        <Badge variant={variant}>{label}</Badge>
      </div>
    </div>
  )
}

function ActivityRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <ActivityRowSkeleton key={i} />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <ClockCounterClockwiseIcon
        className="mb-2 size-8 text-muted-foreground/40"
        weight="duotone"
      />
      <p className="text-sm text-muted-foreground">Sin actividad reciente</p>
    </div>
  )
}

function ErrorState() {
  return (
    <p className="py-6 text-center text-sm text-destructive">
      No se pudo cargar la actividad reciente.
    </p>
  )
}

// ── RecentActivity ─────────────────────────────────────────────────────────────

export function RecentActivity() {
  const { data: items, isPending, isError } = useRecentActivity()

  return (
    <Card className="glass border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground">
          <ClockCounterClockwiseIcon
            className="size-4 text-primary"
            weight="duotone"
          />
          Actividad reciente
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isPending && <LoadingState />}
        {isError && <ErrorState />}
        {!isPending && !isError && (
          <>
            {items.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col gap-1">
                {items.map((item) => {
                   const { label, variant } = STATUS_MAP[item.status]
                   return (
                    <div key={item.id} className="group relative flex items-center justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-primary/5">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-sm font-black tracking-tight text-foreground">
                          {item.travelerName}
                        </span>
                        <span className="truncate text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                          {item.destinationRegion} · {formatDate(item.createdAt.split("T")[0])}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <ActivityAmount amount={item.depositAmount} />
                        <Badge variant={variant} className="h-4.5">{label}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
