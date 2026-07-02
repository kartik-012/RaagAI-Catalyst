import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number, decimals = 0): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toFixed(decimals)
}

export function formatLatency(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`
  return `${Math.round(ms)}ms`
}

export function formatCost(usd: number): string {
  if (usd < 0.001) return `$${(usd * 1000).toFixed(3)}m`
  return `$${usd.toFixed(4)}`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso))
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export function scoreColor(score: number): string {
  if (score >= 0.8) return "text-emerald-500"
  if (score >= 0.6) return "text-amber-500"
  return "text-red-500"
}

export function scoreBg(score: number): string {
  if (score >= 0.8) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  if (score >= 0.6) return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  return "bg-red-500/10 text-red-600 dark:text-red-400"
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    active: "text-emerald-500",
    completed: "text-emerald-500",
    success: "text-emerald-500",
    running: "text-blue-500",
    pending: "text-amber-500",
    processing: "text-blue-500",
    failed: "text-red-500",
    error: "text-red-500",
    warning: "text-amber-500",
    archived: "text-muted-foreground",
  }
  return map[status] ?? "text-muted-foreground"
}

export function truncate(str: string, max = 60): string {
  return str.length > max ? `${str.slice(0, max)}…` : str
}
