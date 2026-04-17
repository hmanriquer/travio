"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowDownIcon,
  ArrowsDownUpIcon,
  ArrowUpIcon,
  DotsThreeIcon,
  EyeIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TravelRequestStatus, TravelRow } from "@/lib/types/travels.types"
import { cn, formatCurrency, formatDate } from "@/lib/utils"

// ── ColumnMeta augmentation ───────────────────────────────────────────────────

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** Applied to every <TableCell> in this column. */
    className?: string
    /** Applied to the <TableHead> of this column. */
    headerClassName?: string
  }
}

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

// ── SortableHeader ────────────────────────────────────────────────────────────

interface SortableHeaderProps {
  column: Column<TravelRow, unknown>
  label: string
  align?: "left" | "right"
}

function SortableHeader({
  column,
  label,
  align = "left",
}: Readonly<SortableHeaderProps>) {
  const sorted = column.getIsSorted()

  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center gap-1.5 transition-colors select-none hover:text-foreground/70",
        align === "right" && "justify-end"
      )}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc" && <ArrowUpIcon className="size-3" weight="bold" />}
      {sorted === "desc" && <ArrowDownIcon className="size-3" weight="bold" />}
      {!sorted && <ArrowsDownUpIcon className="size-3 opacity-30" />}
    </button>
  )
}

// ── RowActions ────────────────────────────────────────────────────────────────

function RowActions({ row }: { row: TravelRow }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-7 data-[state=open]:bg-muted"
            aria-label="Abrir acciones"
          />
        }
      >
        <DotsThreeIcon className="size-4" weight="bold" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/travels/${row.id}`} className="flex w-full items-center gap-2">
            <EyeIcon weight="duotone" className="size-4" />
            Ver detalles
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PencilSimpleIcon weight="duotone" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <TrashIcon weight="duotone" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Column definitions ────────────────────────────────────────────────────────
// Defined at module level so the reference is stable across renders.

const columns: ColumnDef<TravelRow>[] = [
  {
    accessorKey: "travelerName",
    header: ({ column }) => <SortableHeader column={column} label="Viajero" />,
    cell: ({ row }) => (
      <>
        <span className="font-medium">{row.original.travelerName}</span>
        {row.original.travelerDepartment && (
          <span className="block text-xs text-muted-foreground">
            {row.original.travelerDepartment}
          </span>
        )}
      </>
    ),
  },
  {
    accessorKey: "destinationRegion",
    header: ({ column }) => <SortableHeader column={column} label="Destino" />,
  },
  {
    accessorKey: "travelReason",
    enableSorting: false,
    header: "Propósito",
    cell: ({ row }) => (
      <span
        className="block max-w-[200px] truncate"
        title={row.original.travelReason}
      >
        {row.original.travelReason}
      </span>
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => <SortableHeader column={column} label="Fechas" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatDate(row.original.startDate)}
        <span className="mx-1 text-muted-foreground">→</span>
        {formatDate(row.original.endDate)}
        {row.original.days != null && (
          <span className="ml-1.5 text-muted-foreground">
            ({row.original.days}d)
          </span>
        )}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} label="Estado" />,
    cell: ({ row }) => {
      const { label, variant } = STATUS_MAP[row.original.status]
      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: "depositAmount",
    header: ({ column }) => (
      <SortableHeader column={column} label="Depositado" align="right" />
    ),
    meta: { className: "text-right tabular-nums" },
    cell: ({ row }) =>
      row.original.depositAmount
        ? formatCurrency(parseFloat(row.original.depositAmount))
        : "—",
    sortingFn: (a, b) =>
      parseFloat(a.original.depositAmount ?? "0") -
      parseFloat(b.original.depositAmount ?? "0"),
  },
  {
    accessorKey: "provenAmount",
    header: ({ column }) => (
      <SortableHeader column={column} label="Comprobado" align="right" />
    ),
    meta: { className: "text-right tabular-nums" },
    cell: ({ row }) =>
      row.original.provenAmount
        ? formatCurrency(parseFloat(row.original.provenAmount))
        : "—",
    sortingFn: (a, b) =>
      parseFloat(a.original.provenAmount ?? "0") -
      parseFloat(b.original.provenAmount ?? "0"),
  },
  {
    id: "actions",
    enableSorting: false,
    meta: { className: "w-10 text-right" },
    cell: ({ row }) => <RowActions row={row.original} />,
  },
]

// ── Skeleton & Empty ──────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: columns.length }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <TableRow>
      <TableCell
        colSpan={columns.length}
        className="h-48 text-center text-sm text-muted-foreground"
      >
        {hasFilters
          ? "No se encontraron viajes con los filtros aplicados."
          : "No hay solicitudes de viaje registradas."}
      </TableCell>
    </TableRow>
  )
}

// ── TravelsTable ──────────────────────────────────────────────────────────────

interface TravelsTableProps {
  rows: TravelRow[]
  isLoading?: boolean
  hasFilters: boolean
}

export function TravelsTable({
  rows,
  isLoading = false,
  hasFilters,
}: Readonly<TravelsTableProps>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-xl glass border-none shadow-none ring-1 ring-foreground/5">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.headerClassName}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.className}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
