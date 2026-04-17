import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

/**
 * Formats a number as a USD currency string using the es-MX locale.
 * Example: 9170 → "$9,170.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formats a YYYY-MM-DD date string into a human-readable Spanish label.
 * Appends T00:00:00 to avoid UTC offset shifting the displayed day.
 * Example: "2025-07-15" → "15 jul 2025"
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Sin fecha"
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
