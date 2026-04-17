import { AirplaneTiltIcon, SignOutIcon } from "@phosphor-icons/react/dist/ssr"

import { auth, signOut } from "@/auth"
import { NavLinks } from "@/components/nav-links"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"

// ── Sub-components ─────────────────────────────────────────────────────────────

function NavBrand() {
  return (
    <div className="flex items-center gap-2">
      {/* Icon */}
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
        <AirplaneTiltIcon
          weight="duotone"
          className="size-5 text-primary drop-shadow-sm"
        />
      </div>

      {/* Wordmark */}
      <span className="font-fancy text-2xl leading-none font-black tracking-tight text-foreground italic select-none">
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
        <span className="max-w-[160px] truncate text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          {email ?? ""}
        </span>
      </div>

      {/* Avatar */}
      <Avatar className="size-8 ring-1 ring-primary/20">
        <AvatarFallback className="bg-primary/10 text-xs font-black text-primary">
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
          size="icon-sm"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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
    <header className="glass-nav animate-fade-in sticky top-0 z-50 w-full rounded-b-2xl shadow-sm ring-1 ring-foreground/5">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center gap-10">
          <NavBrand />
          <NavLinks />
        </div>
        {session?.user && (
          <UserArea name={session.user.name} email={session.user.email} />
        )}
      </nav>
    </header>
  )
}
