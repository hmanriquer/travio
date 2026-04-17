import { AirplaneTiltIcon } from "@phosphor-icons/react/dist/ssr"

/**
 * AppLoader — global full-page loading indicator.
 *
 * Reuses the same animated blob background and glassmorphism aesthetic
 * as the auth layout so every route transition feels seamless.
 *
 * Used by `app/loading.tsx` (Next.js file-based Suspense boundary).
 * Can also be dropped into any `loading.tsx` at any route segment level.
 */
export function AppLoader() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden">
      {/* ── Centred glass pill ── */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Icon container */}
        <div className="relative flex size-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
          <div className="glass relative flex size-full items-center justify-center rounded-[8px] shadow-xl">
            <AirplaneTiltIcon
              weight="duotone"
              className="size-8 text-primary drop-shadow-md"
            />
          </div>
        </div>

        {/* Wordmark */}
        <p className="font-fancy text-2xl font-black tracking-wide text-foreground italic drop-shadow-sm">
          Travio
        </p>

        {/* Animated dots indicator */}
        <output className="flex items-center gap-1.5" aria-label="Cargando…">
          <span className="size-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
        </output>
      </div>
    </div>
  )
}
