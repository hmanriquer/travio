import { useQuery } from "@tanstack/react-query"

import type { PendingTaskItem } from "@/lib/types/dashboard.types"

async function fetchPendingTasks(): Promise<PendingTaskItem[]> {
  const res = await fetch("/api/dashboard/pending-tasks")
  if (!res.ok) throw new Error("Error al obtener las tareas pendientes")
  return res.json() as Promise<PendingTaskItem[]>
}

export function usePendingTasks() {
  return useQuery({
    queryKey: ["dashboard", "pending-tasks"],
    queryFn: fetchPendingTasks,
  })
}
