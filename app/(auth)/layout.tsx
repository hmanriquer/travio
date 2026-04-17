export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden p-6">
      {/* ── Content ── */}
      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </main>
  )
}
