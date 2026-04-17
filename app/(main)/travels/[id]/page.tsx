"use client"

import { use, useMemo } from "react"
import Link from "next/link"
import {
  AirplaneTiltIcon,
  CalendarIcon,
  CaretLeftIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DownloadSimpleIcon,
  MapPinIcon,
  NoteIcon,
  PlusIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr"

import { EditTravelDialog } from "@/components/travels/edit-travel-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useTravelDetail } from "@/hooks/use-travel-detail"
import { exportTravelsToPdf } from "@/lib/exports/travels-pdf"
import type { TravelRequestStatus } from "@/lib/types/travels.types"
import { cn, formatCurrency, formatDate } from "@/lib/utils"

// ── Maps ──────────────────────────────────────────────────────────────────────

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

// ── Components ────────────────────────────────────────────────────────────────

function DetailItem({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string
  value: React.ReactNode
  icon?: any
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
        {Icon && <Icon weight="bold" className="size-3" />}
        {label}
      </span>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TravelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: travel, isLoading } = useTravelDetail(id)

  // Simulated activity timeline data
  const timeline = useMemo(() => [
    {
      id: "1",
      type: "create",
      title: "Solicitud creada",
      description: "La solicitud fue registrada en el sistema.",
      date: travel?.createdAt || new Date().toISOString(),
      user: "Sistema",
    },
    {
      id: "2",
      type: "update",
      title: "Asignación de viáticos",
      description: `Se asignó un depósito inicial de ${formatCurrency(parseFloat(travel?.depositAmount ?? "0"))}.`,
      date: travel?.createdAt || new Date().toISOString(),
      user: "Administrador",
    },
  ], [travel])

  // Simulated addons (extra expenses)
  const addons = useMemo(() => [
    { id: "1", label: "Transporte local", amount: 450, date: "2024-03-10" },
    { id: "2", label: "Alimentación extra", amount: 320, date: "2024-03-11" },
  ], [])

  const totalAddons = addons.reduce((sum, a) => sum + a.amount, 0)
  const totalAmount = parseFloat(travel?.depositAmount ?? "0") + totalAddons

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 py-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!travel) return <div>No se encontró el viaje.</div>

  const handleExport = () => {
    // Export single travel row
    exportTravelsToPdf([{
      id: travel.id,
      travelerName: travel.traveler.name,
      travelerDepartment: travel.traveler.department,
      destinationRegion: travel.destinationRegion,
      travelReason: travel.travelReason,
      startDate: travel.startDate,
      endDate: travel.endDate,
      days: travel.days,
      status: travel.status,
      depositAmount: travel.depositAmount,
      provenAmount: travel.provenAmount,
    }])
  }

  const { label: statusLabel, variant: statusVariant } = STATUS_MAP[travel.status]

  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4">
        <Link
          href="/travels"
          className="flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeftIcon weight="bold" />
          Regresar a viajes
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex size-12 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-md" />
              <div className="glass relative flex size-full items-center justify-center rounded-lg border-primary/20">
                <AirplaneTiltIcon weight="duotone" className="size-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Detalle del Viaje
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={statusVariant}>{statusLabel}</Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {travel.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <DownloadSimpleIcon className="size-4" />
              PDF
            </Button>
            <EditTravelDialog travel={travel} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column: Info & Addons ── */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Main Info Card */}
          <Card className="glass border-none shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <AirplaneTiltIcon weight="bold" className="size-4 text-primary" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <DetailItem 
                label="Viajero" 
                icon={UserIcon}
                value={
                  <div className="flex flex-col">
                    <span>{travel.traveler.name}</span>
                    <span className="text-xs text-muted-foreground">{travel.traveler.department || "Sin departamento"}</span>
                  </div>
                } 
              />
              <DetailItem 
                label="Destino" 
                icon={MapPinIcon}
                value={travel.destinationRegion} 
              />
              <DetailItem 
                label="Fechas" 
                icon={CalendarIcon}
                value={
                  <div className="flex items-center gap-2">
                    {formatDate(travel.startDate)}
                    <span className="text-muted-foreground">→</span>
                    {formatDate(travel.endDate)}
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-[10px]">
                      {travel.days} días
                    </Badge>
                  </div>
                } 
              />
              <DetailItem 
                label="Motivo" 
                icon={NoteIcon}
                value={travel.travelReason} 
              />
            </CardContent>
          </Card>

          {/* Total & Addons Card */}
          <Card className="relative overflow-hidden border-none shadow-none bg-primary/5">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CurrencyDollarIcon weight="fill" className="size-32" />
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <CurrencyDollarIcon weight="bold" className="size-4 text-primary" />
                Resumen de Gastos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Depósito inicial</span>
                  <span className="font-medium">{formatCurrency(parseFloat(travel.depositAmount ?? "0"))}</span>
                </div>
                
                {addons.map(addon => (
                  <div key={addon.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">{addon.label}</span>
                      <span className="text-[10px] text-muted-foreground/60">{formatDate(addon.date)}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(addon.amount)}</span>
                  </div>
                ))}
                
                <Separator className="bg-primary/10" />
                
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-foreground">Total Proyectado</span>
                  <span className="text-xl font-black text-primary tabular-nums">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-fit glass">
                <PlusIcon weight="bold" />
                Agregar concepto
              </Button>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="glass border-none shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <NoteIcon weight="bold" className="size-4 text-primary" />
                Notas y Observaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border p-8 flex flex-col items-center justify-center text-center gap-2">
                <NoteIcon weight="duotone" className="size-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No hay notas adicionales para este viaje.</p>
                <Button variant="link" size="sm" className="text-primary font-bold">
                  Agregar nota
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column: Timeline ── */}
        <div className="flex flex-col gap-8">
          <Card className="glass border-none shadow-none h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <ClockIcon weight="bold" className="size-4 text-primary" />
                Línea de Tiempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative flex flex-col gap-8 pl-4 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
                {timeline.map((item, idx) => (
                  <div key={item.id} className="relative flex flex-col gap-1">
                    {/* Dot */}
                    <div className={cn(
                      "absolute -left-[21px] top-1 size-3 rounded-full border-2 border-background",
                      idx === 0 ? "bg-primary" : "bg-muted-foreground/40"
                    )} />
                    
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 font-medium">
                      por {item.user}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
