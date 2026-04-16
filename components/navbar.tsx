import { AirplaneTiltIcon, SignOutIcon } from "@phosphor-icons/react/dist/ssr"

import { auth, signOut } from "@/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// ── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name?: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function NavBrand() {
  return (
    <div className="flex items-center gap-2">
      {/* Icon */}
      <AirplaneTiltIcon
        weight="duotone"
        className="size-5 text-primary drop-shadow-sm"
      />

      {/* Wordmark */}
      <span className="font-fancy text-xl leading-none font-black tracking-wide text-foreground italic select-none">
        Travio
      </span>
    </div>
  )
}

interface UserAreaProps {
  name?: string | null
  email?: string | null
}

function UserArea({ name, email }: Readonly<UserAreaProps>) {
  return (
    <div className="flex items-center gap-3">
      {/* User info */}
      <div className="hidden flex-col items-end sm:flex">
        <span className="max-w-[160px] truncate text-xs leading-tight text-muted-foreground">
          {email ?? ""}
        </span>
      </div>

      {/* Avatar */}
      <Avatar className="size-7 ring-1 ring-border">
        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {/* Sign-out */}
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/login" })
        }}
      >
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          title="Cerrar sesión"
        >
          <SignOutIcon className="size-4" />
          <span className="sr-only">Cerrar sesión</span>
        </Button>
      </form>
    </div>
  )
}

// ── Navbar ─────────────────────────────────────────────────────────────────────

/**
 * Sticky glassmorphic navigation bar.
 * Reads the session server-side — safe to place in any Server Component layout.
 */
export async function Navbar() {
  const session = await auth()

  return (
    <header className="glass-nav animate-fade-in sticky top-0 z-50 w-full">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6"
      >
        <NavBrand />
        {session?.user && (
          <UserArea name={session.user.name} email={session.user.email} />
        )}
      </nav>
    </header>
  )
}
