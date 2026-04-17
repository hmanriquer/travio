import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { TravelRow } from "@/lib/types/travels.types"

async function fetchTravels(): Promise<TravelRow[]> {
  const res = await fetch("/api/travels")
  if (!res.ok) throw new Error("Error al obtener los viajes")
  return res.json() as Promise<TravelRow[]>
}

export function useTravels() {
  return useQuery({
    queryKey: ["travels"],
    queryFn: fetchTravels,
  })
}

export function useUpdateTravel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<TravelRow>
    }) => {
      const res = await fetch(`/api/travels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Error al actualizar el viaje")
      return res.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["travels"] })
      queryClient.invalidateQueries({ queryKey: ["travel", id] })
    },
  })
}

export function useDeleteTravel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/travels/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Error al eliminar el viaje")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travels"] })
    },
  })
}
