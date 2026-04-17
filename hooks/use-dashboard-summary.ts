import { useQuery } from "@tanstack/react-query"

import type { DashboardSummary } from "@/lib/types/dashboard.types"

// ── Fetcher ────────────────────────────────────────────────────────────────────

async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch("/api/dashboard/summary")
  if (!res.ok) throw new Error("Error al obtener el resumen del panel")
  return res.json() as Promise<DashboardSummary>
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchDashboardSummary,
  })
}
