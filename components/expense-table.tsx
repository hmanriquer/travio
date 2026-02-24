"use client";

import { useState, useMemo } from "react";
import { travelExpenses, type ApprovalStatus } from "@/lib/data";
import { ExpenseRow } from "@/components/expense-row";

const FILTERS: { label: string; value: ApprovalStatus | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Aprobados", value: "approved" },
  { label: "Pendientes", value: "pending" },
  { label: "Rechazados", value: "rejected" },
];

export function ExpenseTable() {
  const [filter, setFilter] = useState<ApprovalStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return travelExpenses.filter((e) => {
      const matchStatus = filter === "all" || e.status === filter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.travelerName.toLowerCase().includes(q) ||
        e.destination.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [filter, search]);

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1.5 tabular-nums">
                  {travelExpenses.filter(
                    (e) => f.value === "all" || e.status === f.value
                  ).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Buscar viajero, destino..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 sm:w-64"
            aria-label="Buscar viáticos"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left" aria-label="Tabla de viáticos">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                ID
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Viajero
              </th>
              <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
                Destino
              </th>
              <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:table-cell">
                Fechas
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Gasto / Límite
              </th>
              <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground xl:table-cell">
                Uso
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Estado
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="sr-only">Notas</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No se encontraron viáticos con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filtered.map((expense) => (
                <ExpenseRow key={expense.id} expense={expense} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Mostrando{" "}
          <span className="font-medium text-foreground tabular-nums">
            {filtered.length}
          </span>{" "}
          de{" "}
          <span className="font-medium text-foreground tabular-nums">
            {travelExpenses.length}
          </span>{" "}
          registros
        </p>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Haga clic en una fila para ver las notas
        </p>
      </div>
    </div>
  );
}
