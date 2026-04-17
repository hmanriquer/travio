import { ExportView } from "@/components/export/export-view"

export default function ExportPage() {
  return (
    <div className="animate-fade-in flex flex-col gap-6 py-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Exportar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Genera reportes y exportaciones filtradas de las solicitudes de viaje
        </p>
      </header>

      <ExportView />
    </div>
  )
}
