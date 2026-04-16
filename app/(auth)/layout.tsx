export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-6">
      {/* ── Animated Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        <div className="animate-blob absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-primary/20 blur-[100px]" />
        <div className="animate-blob animation-delay-2000 absolute top-[20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-secondary/30 blur-[120px]" />
        <div className="animate-blob animation-delay-4000 absolute bottom-[-20%] left-[20%] h-[70%] w-[70%] rounded-full bg-primary/10 blur-[150px]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </main>
  )
}
