"use client";

import { useState } from "react";
import {
  type TravelExpense,
  formatCurrency,
  formatDate,
  getStatusConfig,
  getBudgetPercentage,
} from "@/lib/data";

function BudgetBar({ spent, limit }: { spent: number; limit: number }) {
  const pct = getBudgetPercentage(spent, limit);
  const isOver = spent > limit;

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 min-w-12 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all ${
            isOver ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span
        className={`text-xs font-medium tabular-nums ${
          isOver ? "text-red-600" : "text-muted-foreground"
        }`}
      >
        {pct}%
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: TravelExpense["status"] }) {
  const config = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

/* ─── Desktop table row (hidden on mobile) ─── */
function DesktopRow({
  expense,
  expanded,
  onToggle,
}: {
  expense: TravelExpense;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isOver = expense.amountSpent > expense.expenseLimit;

  return (
    <>
      <tr
        className="group hidden cursor-pointer border-b border-border transition-colors hover:bg-muted/50 md:table-row"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {/* ID */}
        <td className="px-4 py-3.5">
          <span className="font-mono text-xs text-muted-foreground">
            {expense.id}
          </span>
        </td>

        {/* Traveler */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              aria-hidden="true"
            >
              {expense.travelerInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {expense.travelerName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {expense.travelerRole}
              </p>
            </div>
          </div>
        </td>

        {/* Destination */}
        <td className="hidden px-4 py-3.5 lg:table-cell">
          <p className="text-sm text-foreground">{expense.destination}</p>
          <p className="text-xs text-muted-foreground">{expense.country}</p>
        </td>

        {/* Dates */}
        <td className="hidden px-4 py-3.5 xl:table-cell">
          <p className="text-sm text-foreground">
            {formatDate(expense.departureDate)}
          </p>
          <p className="text-xs text-muted-foreground">
            {"a "}
            {formatDate(expense.returnDate)}
          </p>
        </td>

        {/* Amount spent */}
        <td className="px-4 py-3.5 text-right">
          <p
            className={`text-sm font-semibold tabular-nums ${
              isOver ? "text-red-600" : "text-foreground"
            }`}
          >
            {formatCurrency(expense.amountSpent)}
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {"/ "}
            {formatCurrency(expense.expenseLimit)}
          </p>
        </td>

        {/* Budget usage */}
        <td className="hidden px-4 py-3.5 xl:table-cell">
          <BudgetBar spent={expense.amountSpent} limit={expense.expenseLimit} />
        </td>

        {/* Status */}
        <td className="px-4 py-3.5 text-center">
          <StatusBadge status={expense.status} />
        </td>

        {/* Expand indicator */}
        <td className="px-4 py-3.5 text-center">
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
            className={`inline-block text-muted-foreground transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span className="sr-only">
            {expanded ? "Ocultar notas" : "Ver notas"}
          </span>
        </td>
      </tr>

      {/* Expandable notes row (desktop) */}
      {expanded && (
        <tr className="hidden border-b border-border bg-muted/30 md:table-row">
          <td colSpan={8} className="px-4 py-4">
            <div className="ml-12 flex flex-col gap-2 border-l-2 border-primary/30 pl-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  {expense.category}
                </span>
                <span className="lg:hidden inline-flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {expense.destination}, {expense.country}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {expense.notes}
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ─── Mobile card (hidden on md+) ─── */
function MobileCard({
  expense,
  expanded,
  onToggle,
}: {
  expense: TravelExpense;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isOver = expense.amountSpent > expense.expenseLimit;

  return (
    <div className="border-b border-border md:hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/50"
        aria-expanded={expanded}
      >
        {/* Top row: avatar + name + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              aria-hidden="true"
            >
              {expense.travelerInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {expense.travelerName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {expense.travelerRole}
              </p>
            </div>
          </div>
          <StatusBadge status={expense.status} />
        </div>

        {/* Middle row: destination + dates */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {expense.destination}, {expense.country}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatDate(expense.departureDate)} - {formatDate(expense.returnDate)}
          </span>
        </div>

        {/* Bottom row: amount + budget bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-sm font-semibold tabular-nums ${
                isOver ? "text-red-600" : "text-foreground"
              }`}
            >
              {formatCurrency(expense.amountSpent)}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              / {formatCurrency(expense.expenseLimit)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16">
              <BudgetBar
                spent={expense.amountSpent}
                limit={expense.expenseLimit}
              />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-muted-foreground transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </button>

      {/* Expandable notes (mobile) */}
      {expanded && (
        <div className="border-t border-border bg-muted/30 px-4 py-3">
          <div className="flex flex-col gap-2 border-l-2 border-primary/30 pl-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono">{expense.id}</span>
              <span className="inline-flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                {expense.category}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {expense.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Public component: renders both layouts ─── */
export function ExpenseRow({ expense }: { expense: TravelExpense }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <DesktopRow
        expense={expense}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      />
      {/* Mobile card rendered outside the <table> via a portal-like approach.
          We render it inside a <tr><td> with colSpan to keep valid HTML. */}
      <tr className="md:hidden">
        <td colSpan={8} className="p-0">
          <MobileCard
            expense={expense}
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
          />
        </td>
      </tr>
    </>
  );
}
