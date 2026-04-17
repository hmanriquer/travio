import Link from "next/link"
import { AirplaneTiltIcon } from "@phosphor-icons/react/dist/ssr"

/**
 * Global 404 page — rendered for any route that doesn't match.
 * Server Component by default (no "use client" needed).
 */
export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden p-6">
      {/* ── Content ── */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="relative flex size-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
          <div className="glass relative flex size-full items-center justify-center rounded-[8px] shadow-xl">
            <AirplaneTiltIcon
              weight="duotone"
              className="size-8 text-primary drop-shadow-md"
            />
          </div>
        </div>

        {/* 404 callout */}
        <div className="flex flex-col gap-1.5">
          <p className="font-fancy text-6xl font-black tracking-wide text-foreground/20 italic drop-shadow-sm select-none">
            404
          </p>
          <h1 className="text-lg font-semibold text-foreground">
            Página no encontrada
          </h1>
          <p className="text-sm text-muted-foreground">
            La ruta que buscas no existe o fue movida. Verifica la URL e intenta
            de nuevo.
          </p>
        </div>

        {/* Action */}
        <Link
          href="/"
          className="glass hover-lift w-full px-4 py-2 text-center text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-primary/10"
        >
          Regresar al inicio
        </Link>
      </div>
    </div>
  )
}
