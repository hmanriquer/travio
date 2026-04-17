import { PendingTasks } from "@/components/dashboard/pending-tasks"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { SummaryCards } from "@/components/dashboard/summary-cards"

export default function DashboardPage() {
  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-black tracking-tight font-fancy italic">Panel de Control</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen general de tus viajes y gastos
        </p>
      </header>

      <SummaryCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity />
        <PendingTasks />
      </div>
    </div>
  )
}
