import { useQuery } from "@tanstack/react-query"

// ── Types ──────────────────────────────────────────────────────────────────────

export type TravelerOption = {
  id: string
  name: string
  department: string | null
  jobTitle: string | null
}

// ── Fetcher ────────────────────────────────────────────────────────────────────

async function fetchTravelers(): Promise<TravelerOption[]> {
  const res = await fetch("/api/travelers")
  if (!res.ok) throw new Error("Error al obtener la lista de viajeros")
  return res.json() as Promise<TravelerOption[]>
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useTravelers() {
  return useQuery({
    queryKey: ["travelers"],
    queryFn: fetchTravelers,
    staleTime: 5 * 60 * 1000, // travelers rarely change — cache for 5 min
  })
}
