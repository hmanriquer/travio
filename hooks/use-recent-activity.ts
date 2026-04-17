import { useQuery } from "@tanstack/react-query"

import type { RecentActivityItem } from "@/lib/types/dashboard.types"

async function fetchRecentActivity(limit: number): Promise<RecentActivityItem[]> {
  const res = await fetch(`/api/dashboard/recent-activity?limit=${limit}`)
  if (!res.ok) throw new Error("Error al obtener la actividad reciente")
  return res.json() as Promise<RecentActivityItem[]>
}

export function useRecentActivity(limit = 5) {
  return useQuery({
    queryKey: ["dashboard", "recent-activity", limit],
    queryFn: () => fetchRecentActivity(limit),
  })
}
