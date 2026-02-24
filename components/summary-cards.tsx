"use client";

import { useExpenses } from "@/components/expenses-provider";
import { formatCurrency } from "@/lib/data";

function StatCard({
  label,
  value,
  subtext,
  accentClass,
}: {
  label: string;
  value: string;
  subtext: string;
  accentClass: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${accentClass}`} />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-xl font-semibold tracking-tight text-card-foreground sm:text-2xl">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}

export function SummaryCards() {
  const { expenses } = useExpenses();

  const totalSpent = expenses.reduce((s, e) => s + e.amountSpent, 0);
  const totalLimit = expenses.reduce((s, e) => s + e.expenseLimit, 0);
  const approved = expenses.filter((e) => e.status === "approved").length;
  const pending = expenses.filter((e) => e.status === "pending").length;
  const rejected = expenses.filter((e) => e.status === "rejected").length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <StatCard
        label="Total Gastado"
        value={formatCurrency(totalSpent)}
        subtext={`de ${formatCurrency(totalLimit)} presupuestado`}
        accentClass="bg-primary"
      />
      <StatCard
        label="Aprobados"
        value={String(approved)}
        subtext={`de ${expenses.length} viajes`}
        accentClass="bg-emerald-500"
      />
      <StatCard
        label="Pendientes"
        value={String(pending)}
        subtext="requieren revisión"
        accentClass="bg-amber-500"
      />
      <StatCard
        label="Rechazados"
        value={String(rejected)}
        subtext="fuera de presupuesto"
        accentClass="bg-red-500"
      />
    </div>
  );
}
