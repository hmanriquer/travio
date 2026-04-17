import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { CreateTravelFormValues } from "@/lib/validations/travel.schema"

// ── Fetcher ────────────────────────────────────────────────────────────────────

async function createTravel(data: CreateTravelFormValues): Promise<void> {
  const res = await fetch("/api/travels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? "Error al crear la solicitud de viaje")
  }
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useCreateTravel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTravel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travels"] })
    },
  })
}
