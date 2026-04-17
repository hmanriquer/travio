"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const links = [
  { name: "Panel", href: "/" },
  { name: "Viajes", href: "/travels" },
  { name: "Exportar", href: "/export" },
  { name: "Cumplimiento", href: "/compliance" },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
      {links.map((link) => {
        const isActive =
          pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))

        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "relative transition-all hover:text-foreground py-1",
              isActive ? "text-primary font-black" : "text-muted-foreground/70"
            )}
          >
            {link.name}
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
