"use client"

/**
 * BackgroundBlobs — A stunning, minimal animated background.
 * Includes floating blobs with blur and a subtle dot grid pattern.
 * Uses -z-10 to stay behind all content while maintaining the theme's aesthetic.
 */
export function BackgroundBlobs() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* ── Floating Blobs ── */}
      <div className="animate-blob absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-primary/20 blur-[100px]" />
      <div className="animate-blob animation-delay-2000 absolute top-[20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-secondary/30 blur-[120px]" />
      <div className="animate-blob animation-delay-4000 absolute bottom-[-20%] left-[20%] h-[70%] w-[70%] rounded-full bg-primary/10 blur-[150px]" />
      <div className="animate-blob animation-delay-2000 absolute bottom-[10%] right-[10%] h-[40%] w-[40%] rounded-full bg-secondary/15 blur-[80px]" />
      
      {/* ── Subtle Dot Grid ── */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* ── Global Vignette ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,oklch(from_var(--background)_l_c_h_/_20%)_100%)]" />
    </div>
  )
}
