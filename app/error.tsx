"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { WarningCircleIcon } from "@phosphor-icons/react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Global error boundary — Next.js renders this whenever an unhandled runtime
 * error is thrown inside a route segment. Must be a Client Component.
 */
export default function ErrorPage({ error, reset }: Readonly<ErrorPageProps>) {
  const router = useRouter()

  useEffect(() => {
    console.error("[ErrorBoundary]", error)
  }, [error])

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-6">
      {/* ── Animated blobs ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="animate-blob absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-destructive/10 blur-[100px]" />
        <div className="animate-blob animation-delay-2000 absolute top-[20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="animate-blob animation-delay-4000 absolute bottom-[-20%] left-[20%] h-[70%] w-[70%] rounded-full bg-destructive/5 blur-[150px]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="relative flex size-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-destructive/20 blur-xl" />
          <div className="glass relative flex size-full items-center justify-center rounded-[8px] shadow-xl">
            <WarningCircleIcon
              weight="duotone"
              className="size-8 text-destructive drop-shadow-md"
            />
          </div>
        </div>

        {/* Wordmark */}
        <p className="font-fancy text-2xl font-black tracking-wide text-foreground italic drop-shadow-sm">
          Travio
        </p>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-lg font-semibold text-foreground">
            Algo salió mal
          </h1>
          <p className="text-sm text-muted-foreground">
            Ocurrió un error inesperado. Puedes intentarlo de nuevo o regresar
            al inicio.
          </p>
          {error.digest && (
            <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">
              ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-2">
          <button
            onClick={reset}
            className="glass hover-lift w-full px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-primary/10"
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-2 text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  )
}
