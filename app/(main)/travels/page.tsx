import { AddTravelDialog } from "@/components/travels/add-travel-dialog"
import { TravelsView } from "@/components/travels/travels-view"

export default function TravelsPage() {
  return (
    <div className="animate-fade-in flex flex-col gap-6 py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Viajes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestión y seguimiento de todas las solicitudes de viaje
          </p>
        </div>

        <AddTravelDialog />
      </header>

      <TravelsView />
    </div>
  )
}
