import { useQuery } from "@tanstack/react-query"

import type { TravelDetail } from "@/lib/types/travels.types"

async function fetchTravelDetail(id: string): Promise<TravelDetail> {
  const res = await fetch(`/api/travels/${id}`)
  if (!res.ok) throw new Error("Error al obtener el detalle del viaje")
  return res.json() as Promise<TravelDetail>
}

export function useTravelDetail(id: string) {
  return useQuery({
    queryKey: ["travel", id],
    queryFn: () => fetchTravelDetail(id),
    enabled: !!id,
  })
}
