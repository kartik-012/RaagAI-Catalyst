import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

type Variant = "default" | "success" | "warning" | "error" | "info" | "outline"

const variants: Record<Variant, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  outline: "bg-transparent text-foreground border-border",
}

interface BadgeProps {
  children: ReactNode
  variant?: Variant
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Variant> = {
    active: "success", completed: "success", success: "success", ready: "success",
    running: "info", processing: "info", pending: "warning",
    failed: "error", error: "error",
    archived: "outline",
  }
  return <Badge variant={map[status] ?? "outline"}>{status}</Badge>
}
