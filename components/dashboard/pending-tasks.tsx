"use client"

import { MapPinIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePendingTasks } from "@/hooks/use-pending-tasks"
import type { PendingTaskItem, TaskPriority } from "@/lib/types/dashboard.types"
import { formatDate } from "@/lib/utils"

// ── Maps ───────────────────────────────────────────────────────────────────────

const PRIORITY_BADGE_VARIANT: Record<
  TaskPriority,
  "destructive" | "default" | "outline"
> = {
  alta: "destructive",
  media: "default",
  baja: "outline",
}

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function PendingTasksSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start justify-between gap-4 py-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-3 w-52" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-8 w-16 shrink-0" />
        </div>
      ))}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <p className="py-6 text-center text-sm text-muted-foreground">
      No hay tareas pendientes. ¡Todo al día!
    </p>
  )
}

type TaskRowProps = {
  task: PendingTaskItem
}

function TaskRow({ task }: Readonly<TaskRowProps>) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      {/* Task info */}
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm leading-tight font-medium">
            {task.travelerName}
          </span>
          <Badge variant={PRIORITY_BADGE_VARIANT[task.priority]}>
            {PRIORITY_LABEL[task.priority]}
          </Badge>
        </div>
        <span className="truncate text-xs text-muted-foreground">
          {task.travelReason} · {task.destinationRegion}
        </span>
        <span className="text-xs text-muted-foreground">
          Viaje: {formatDate(task.startDate)}
          {task.proofDeadline && (
            <> · Comprobación: {formatDate(task.proofDeadline)}</>
          )}
        </span>
      </div>

      {/* Action */}
      <Button variant="outline" size="sm" className="shrink-0">
        Revisar
      </Button>
    </div>
  )
}

// ── PendingTasks ───────────────────────────────────────────────────────────────

export function PendingTasks() {
  const { data: tasks, isPending, isError } = usePendingTasks()

  const renderContent = () => {
    if (isPending) return <PendingTasksSkeleton />
    if (isError)
      return (
        <p className="py-6 text-center text-sm text-destructive font-medium">
          Error al cargar las tareas.
        </p>
      )
    if (!tasks || tasks.length === 0) return <EmptyState />
    return (
      <div className="flex flex-col gap-1">
        {tasks.map((task) => (
          <div key={task.id} className="group relative flex items-start justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-primary/5">
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm leading-tight font-black tracking-tight text-foreground">
                  {task.travelerName}
                </span>
                <Badge variant={PRIORITY_BADGE_VARIANT[task.priority]} className="h-4.5">
                  {PRIORITY_LABEL[task.priority]}
                </Badge>
              </div>
              <span className="truncate text-xs font-medium text-muted-foreground/80">
                {task.travelReason}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5 mt-0.5">
                <MapPinIcon className="size-3" weight="bold" />
                {task.destinationRegion}
                <span className="text-muted-foreground/30">|</span>
                {formatDate(task.startDate)}
              </span>
            </div>
            <Button variant="outline" size="xs" className="shrink-0 glass shadow-none hover:bg-primary hover:text-primary-foreground border-primary/20">
              Revisar
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="glass border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground">
          <WarningCircleIcon
            className="size-4 text-primary"
            weight="duotone"
          />
          Tareas prioritarias
          {tasks && tasks.length > 0 && (
            <Badge variant="secondary" className="ml-auto rounded-md px-1.5 py-0 h-5 lowercase font-medium">
              {tasks.length} pendiente{tasks.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}
