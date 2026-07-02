"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Database, Cpu, BarChart3, MessageSquare, Shield,
  CheckCircle, Send, ChevronDown, ChevronRight, Clock,
  Zap, AlertTriangle, XCircle, Copy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import type { PipelineNodeData } from "@/data/traceData"
import { toast } from "sonner"

const nodeIcons: Record<string, typeof User> = {
  user: User, retriever: Database, embedding: Cpu, ranking: BarChart3,
  llm: MessageSquare, guardrail: Shield, evaluation: CheckCircle, output: Send,
}

const nodeColors: Record<string, string> = {
  user: "#6366f1", retriever: "#3b82f6", embedding: "#8b5cf6", ranking: "#f59e0b",
  llm: "#a855f7", guardrail: "#f97316", evaluation: "#10b981", output: "#06b6d4",
}

const nodeBgColors: Record<string, string> = {
  user: "bg-indigo-500/10", retriever: "bg-blue-500/10", embedding: "bg-violet-500/10",
  ranking: "bg-amber-500/10", llm: "bg-purple-500/10", guardrail: "bg-orange-500/10",
  evaluation: "bg-emerald-500/10", output: "bg-cyan-500/10",
}

const statusConfig = {
  success: { color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle, label: "SUCCESS" },
  error: { color: "text-red-500", bg: "bg-red-500/10 border-red-500/30", icon: XCircle, label: "ERROR" },
  warning: { color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/30", icon: AlertTriangle, label: "WARNING" },
}

interface PipelineNodeProps {
  node: PipelineNodeData
  isExpanded: boolean
  onToggle: () => void
  index: number
}

export function PipelineNode({ node, isExpanded, onToggle, index }: PipelineNodeProps) {
  const Icon = nodeIcons[node.type] ?? Cpu
  const color = nodeColors[node.type] ?? "#6366f1"
  const bgColor = nodeBgColors[node.type] ?? "bg-indigo-500/10"
  const status = statusConfig[node.status]
  const StatusIcon = status.icon

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="group"
    >
      <div
        className={cn(
          "relative rounded-xl border bg-card overflow-hidden transition-all duration-200",
          "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20",
          isExpanded ? "shadow-md" : "shadow-sm",
        )}
        style={{ borderLeftWidth: "3px", borderLeftColor: color }}
      >
        {/* Header */}
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/30 transition-colors"
        >
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", bgColor)}>
            <Icon className="w-4.5 h-4.5" style={{ color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{node.name}</span>
              {node.tokens && (
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  <Zap className="w-2.5 h-2.5 inline mr-0.5" />{node.tokens.total} tok
                </span>
              )}
            </div>
            {node.latency_ms > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground font-mono">{node.latency_ms}ms</span>
              </div>
            )}
          </div>

          {/* Status badge */}
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border", status.bg)}>
            <StatusIcon className={cn("w-3 h-3", status.color)} />
            <span className={status.color}>{status.label}</span>
          </div>

          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </button>

        {/* Collapsed preview */}
        {!isExpanded && (
          <div className="px-4 pb-3 flex gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">Input</p>
              <p className="text-xs text-muted-foreground truncate">{node.input}</p>
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">Output</p>
              <p className="text-xs text-muted-foreground truncate">{node.output}</p>
            </div>
          </div>
        )}

        {/* Expanded detail */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border px-4 py-4 space-y-4">
                {/* Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide">Input Payload</p>
                    <button onClick={() => copyText(node.input, "Input")} className="text-muted-foreground hover:text-foreground transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs text-foreground leading-relaxed border border-border/50">
                    {node.input}
                  </div>
                </div>

                {/* Output */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide">Output Payload</p>
                    <button onClick={() => copyText(node.output, "Output")} className="text-muted-foreground hover:text-foreground transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className={cn(
                    "rounded-lg p-3 font-mono text-xs leading-relaxed border",
                    node.status === "error" ? "bg-red-500/5 border-red-500/20 text-red-400" :
                    node.status === "warning" ? "bg-amber-500/5 border-amber-500/20 text-amber-400" :
                    "bg-muted/50 border-border/50 text-foreground"
                  )}>
                    {node.output}
                  </div>
                </div>

                {/* Metadata */}
                {Object.keys(node.metadata).length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1.5">Metadata</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(node.metadata).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-muted/30 rounded-md px-2.5 py-1.5 border border-border/30">
                          <span className="text-[11px] text-muted-foreground">{key.replace(/_/g, " ")}</span>
                          <span className="text-[11px] font-medium font-mono text-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Token usage */}
                {node.tokens && (
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1.5">Token Usage</p>
                    <div className="flex gap-3">
                      {[
                        { label: "Input", value: node.tokens.input },
                        { label: "Output", value: node.tokens.output },
                        { label: "Total", value: node.tokens.total },
                      ].map((t) => (
                        <div key={t.label} className="flex-1 bg-muted/30 rounded-lg p-2.5 text-center border border-border/30">
                          <p className="text-[10px] text-muted-foreground">{t.label}</p>
                          <p className="text-sm font-bold font-mono text-foreground">{t.value.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
