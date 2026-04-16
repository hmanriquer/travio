/**
 * @file lib/logger.ts
 * @description Global development logger for Travio.
 *
 * - Color-coded, level-aware console output (debug / info / warn / error).
 * - Namespace support via `logger.child("scope")` for easy DevTools filtering.
 * - Completely silent in production (`NODE_ENV !== "development"`).
 * - Works in both Next.js server components/actions and client components.
 *
 * @example
 *   import { logger } from "@/lib/logger"
 *
 *   // Root logger
 *   logger.info("App started")
 *
 *   // Scoped child logger
 *   const log = logger.child("auth")
 *   log.debug("Checking credentials", { email })
 *   log.error("Sign-in failed", error)
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface Logger {
  debug(message: string, ...args: unknown[]): void
  info(message: string, ...args: unknown[]): void
  warn(message: string, ...args: unknown[]): void
  error(message: string, ...args: unknown[]): void
  /** Create a namespaced child logger. Namespaces can be nested: child("a").child("b") */
  child(namespace: string): Logger
}

// ── Config ─────────────────────────────────────────────────────────────────────

const IS_DEV = process.env.NODE_ENV === "development"

/** Minimum level to emit. Change to "info" to suppress debug logs. */
const MIN_LEVEL: LogLevel = "debug"

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// ── Styles (browser DevTools) ──────────────────────────────────────────────────

const LEVEL_STYLES: Record<LogLevel, string> = {
  debug: "color: #94a3b8; font-weight: 400;", // slate-400
  info: "color: #38bdf8; font-weight: 600;", // sky-400
  warn: "color: #fbbf24; font-weight: 700;", // amber-400
  error: "color: #f87171; font-weight: 700;", // red-400
}

const NAMESPACE_STYLE = "color: #a78bfa; font-weight: 500;" // violet-400
const RESET_STYLE = "color: inherit; font-weight: 400;"

// ── Helpers ────────────────────────────────────────────────────────────────────

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

function timestamp(): string {
  const d = new Date()
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, "0")}`
}

function shouldLog(level: LogLevel): boolean {
  return IS_DEV && LEVEL_ORDER[level] >= LEVEL_ORDER[MIN_LEVEL]
}

type ConsoleFn = (...data: unknown[]) => void

function resolveConsoleFn(level: LogLevel): ConsoleFn {
  if (level === "error") return console.error
  if (level === "warn") return console.warn
  if (level === "debug") return console.debug
  return console.info
}

// ── Core emit ─────────────────────────────────────────────────────────────────

function emit(
  namespace: string | undefined,
  level: LogLevel,
  message: string,
  args: unknown[]
): void {
  if (!shouldLog(level)) return

  const tag = `[${level.toUpperCase()}]`
  const ts = timestamp()
  const scope = namespace ? `[${namespace}]` : ""
  const fn = resolveConsoleFn(level)

  if (typeof window !== "undefined") {
    // ── Browser: styled console output ────────────────────────────────────
    const parts: string[] = [`%c${ts} %c${tag}`]
    const styles: string[] = [RESET_STYLE, LEVEL_STYLES[level]]

    if (scope) {
      parts.push(`%c${scope}`)
      styles.push(NAMESPACE_STYLE)
    }

    parts.push(`%c ${message}`)
    styles.push(RESET_STYLE)

    fn(parts.join(""), ...styles, ...args)
  } else {
    // ── Server / Edge: plain text (Next.js server logs) ───────────────────
    const prefix = [ts, tag, scope].filter(Boolean).join(" ")
    fn(`${prefix} ${message}`, ...args)
  }
}

// ── Factory ────────────────────────────────────────────────────────────────────

function createLogger(namespace?: string): Logger {
  return {
    debug(message, ...args) {
      emit(namespace, "debug", message, args)
    },
    info(message, ...args) {
      emit(namespace, "info", message, args)
    },
    warn(message, ...args) {
      emit(namespace, "warn", message, args)
    },
    error(message, ...args) {
      emit(namespace, "error", message, args)
    },
    child(ns: string): Logger {
      return createLogger(namespace ? `${namespace}:${ns}` : ns)
    },
  }
}

// ── Singleton export ───────────────────────────────────────────────────────────

export const logger = createLogger()
