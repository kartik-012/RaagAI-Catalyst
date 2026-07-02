"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { PipelineTrace } from "@/data/traceData"

const nodeColors: Record<string, string> = {
  user: "#6366f1", retriever: "#3b82f6", embedding: "#8b5cf6", ranking: "#f59e0b",
  llm: "#a855f7", guardrail: "#f97316", evaluation: "#10b981", output: "#06b6d4",
}

export function TraceTimeline({ trace }: { trace: PipelineTrace }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const totalLatency = trace.nodes.reduce((sum, n) => sum + n.latency_ms, 0) || 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Latency Distribution</p>
        <p className="text-xs font-mono text-muted-foreground">{totalLatency}ms total</p>
      </div>

      <div className="relative flex h-8 rounded-lg overflow-hidden bg-muted/30 border border-border/50">
        {trace.nodes.map((node, i) => {
          const pct = (node.latency_ms / totalLatency) * 100
          if (pct < 0.5) return null
          return (
            <motion.div
              key={node.id}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
              className="relative h-full cursor-pointer transition-opacity"
              style={{
                width: `${pct}%`,
                backgroundColor: `${nodeColors[node.type]}30`,
                borderRight: "1px solid hsl(var(--border))",
                originX: 0,
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: nodeColors[node.type] }}
              />

              {/* Tooltip */}
              {hoveredIdx === i && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none"
                >
                  <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                    <p className="text-xs font-semibold text-foreground">{node.name}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{node.latency_ms}ms ({pct.toFixed(1)}%)</p>
                  </div>
                </motion.div>
              )}

              {/* Label if segment is wide enough */}
              {pct > 10 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-foreground/70 truncate px-1">
                    {node.type}
                  </span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {trace.nodes.filter(n => n.latency_ms > 0).map((node) => (
          <div key={node.id} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: nodeColors[node.type] }} />
            <span className="text-[10px] text-muted-foreground">{node.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
