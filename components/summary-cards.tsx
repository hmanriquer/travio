import {
  travelExpenses,
  formatCurrency,
} from "@/lib/data";

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
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${accentClass}`} />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-card-foreground">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}

export function SummaryCards() {
  const totalSpent = travelExpenses.reduce((s, e) => s + e.amountSpent, 0);
  const totalLimit = travelExpenses.reduce((s, e) => s + e.expenseLimit, 0);
  const approved = travelExpenses.filter((e) => e.status === "approved").length;
  const pending = travelExpenses.filter((e) => e.status === "pending").length;
  const rejected = travelExpenses.filter((e) => e.status === "rejected").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Gastado"
        value={formatCurrency(totalSpent)}
        subtext={`de ${formatCurrency(totalLimit)} presupuestado`}
        accentClass="bg-primary"
      />
      <StatCard
        label="Aprobados"
        value={String(approved)}
        subtext={`de ${travelExpenses.length} viajes`}
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
