"use client"
import { motion } from "framer-motion"
import { Clock, Zap, DollarSign, Activity, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PipelineTrace } from "@/data/traceData"

const statusConfig = {
  success: { icon: CheckCircle, label: "Pipeline Complete", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  error: { icon: XCircle, label: "Pipeline Failed", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  warning: { icon: AlertTriangle, label: "Pipeline Warning", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
}

export function TraceSummaryBar({ trace }: { trace: PipelineTrace }) {
  const status = statusConfig[trace.status]
  const StatusIcon = status.icon

  const metrics = [
    { icon: Activity, label: "Status", value: status.label, color: status.color },
    { icon: Clock, label: "Total Latency", value: `${(trace.total_latency_ms / 1000).toFixed(2)}s`, color: "text-foreground" },
    { icon: Zap, label: "Total Tokens", value: trace.total_tokens.toLocaleString(), color: "text-foreground" },
    { icon: DollarSign, label: "Total Cost", value: `$${trace.total_cost.toFixed(4)}`, color: "text-foreground" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Gradient top accent */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="px-5 py-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
              <m.icon className={cn("w-4.5 h-4.5", i === 0 ? status.color : "text-muted-foreground")} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide">{m.label}</p>
              <p className={cn("text-lg font-bold font-mono", m.color)}>{m.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function PipelineStatusBadge({ status, position }: { status: "success" | "error" | "warning"; position: "top" | "bottom" }) {
  const config = {
    top: { label: "TRIGGERED", colors: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" },
    bottom: statusConfig[status],
  }
  const c = position === "top" ? config.top : config.bottom

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-center py-2"
    >
      <div className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border tracking-wide",
        position === "top" ? config.top.colors : `${statusConfig[status].bg} ${statusConfig[status].color}`
      )}>
        {position === "bottom" && <StatusIcon className={cn("w-3.5 h-3.5", statusConfig[status].color)} />}
        {position === "top" ? "⚡ TRIGGERED" : `✓ ${statusConfig[status].label.toUpperCase()}`}
      </div>
    </motion.div>
  )

  function StatusIcon({ className }: { className?: string }) {
    const Icon = statusConfig[status].icon
    return <Icon className={className} />
  }
}
