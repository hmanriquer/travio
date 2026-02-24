"use client";

import { useState, useMemo } from "react";
import { type ApprovalStatus } from "@/lib/data";
import { useExpenses } from "@/components/expenses-provider";
import { ExpenseRow } from "@/components/expense-row";
import { AddExpenseForm } from "@/components/add-expense-form";

const FILTERS: { label: string; value: ApprovalStatus | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Aprobados", value: "approved" },
  { label: "Pendientes", value: "pending" },
  { label: "Rechazados", value: "rejected" },
];

export function ExpenseTable() {
  const { expenses } = useExpenses();
  const [filter, setFilter] = useState<ApprovalStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
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
  }, [filter, search, expenses]);

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4">
          {/* Row 1: Filters + Add button */}
          <div className="flex items-center justify-between gap-3">
            {/* Filter tabs - scrollable on mobile */}
            <div
              className="-mx-1 flex overflow-x-auto scrollbar-none"
              role="tablist"
            >
              <div className="flex gap-1 rounded-lg bg-muted p-1">
                {FILTERS.map((f) => {
                  const count =
                    f.value === "all"
                      ? expenses.length
                      : expenses.filter((e) => e.status === f.value).length;
                  return (
                    <button
                      key={f.value}
                      role="tab"
                      aria-selected={filter === f.value}
                      onClick={() => setFilter(f.value)}
                      className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        filter === f.value
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.label}
                      <span className="ml-1.5 tabular-nums">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add button */}
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-3.5"
            >
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
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="hidden sm:inline">Nuevo Viático</span>
            </button>
          </div>

          {/* Row 2: Search */}
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
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 sm:max-w-xs"
              aria-label="Buscar viáticos"
            />
          </div>
        </div>

        {/* Desktop table header (hidden on mobile) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left" aria-label="Tabla de viáticos">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  ID
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Viajero
                </th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:table-cell">
                  Destino
                </th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground xl:table-cell">
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
              {expenses.length}
            </span>{" "}
            registros
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Toque una fila para ver notas
          </p>
        </div>
      </div>

      {/* Add expense slide-over form */}
      <AddExpenseForm open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
