"use client"
import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Maximize2, Minimize2, ChevronDown, GitBranch } from "lucide-react"
import { Topbar } from "@/components/layout/Topbar"
import { Button } from "@/components/ui/Button"
import { PipelineNode } from "@/components/trace-studio/PipelineNode"
import { PipelineConnector } from "@/components/trace-studio/PipelineConnector"
import { TraceSummaryBar, PipelineStatusBadge } from "@/components/trace-studio/TraceSummaryBar"
import { TraceTimeline } from "@/components/trace-studio/TraceTimeline"
import { PIPELINE_TRACES } from "@/data/traceData"
import { cn } from "@/lib/utils"

export default function TraceStudioPage() {
  const params = useParams()
  const router = useRouter()
  const traceId = params.traceId as string

  const [selectedTraceId, setSelectedTraceId] = useState(traceId || PIPELINE_TRACES[0].id)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [allExpanded, setAllExpanded] = useState(false)
  const [selectorOpen, setSelectorOpen] = useState(false)

  const trace = useMemo(
    () => PIPELINE_TRACES.find((t) => t.id === selectedTraceId) ?? PIPELINE_TRACES[0],
    [selectedTraceId]
  )

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedNodes(new Set())
      setAllExpanded(false)
    } else {
      setExpandedNodes(new Set(trace.nodes.map((n) => n.id)))
      setAllExpanded(true)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Trace Studio" />
      <main className="flex-1 overflow-y-auto">
        {/* Controls bar */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
              onClick={() => router.push("/dashboard/traces")}
            >
              Back
            </Button>

            <div className="w-px h-6 bg-border" />

            {/* Trace selector */}
            <div className="relative">
              <button
                onClick={() => setSelectorOpen(!selectorOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border text-sm hover:bg-muted transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">{trace.id}</span>
                <span className="text-muted-foreground text-xs truncate max-w-[200px]">— {trace.query}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {selectorOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setSelectorOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-1 w-96 bg-popover border border-border rounded-xl shadow-2xl z-40 overflow-hidden"
                  >
                    {PIPELINE_TRACES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setSelectedTraceId(t.id); setSelectorOpen(false); setExpandedNodes(new Set()); setAllExpanded(false) }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0",
                          t.id === selectedTraceId && "bg-primary/5"
                        )}
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          t.status === "success" ? "bg-emerald-500" : t.status === "error" ? "bg-red-500" : "bg-amber-500"
                        )} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{t.id}</p>
                          <p className="text-xs text-muted-foreground truncate">{t.query}</p>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground shrink-0">{t.project}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>

            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                icon={allExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                onClick={toggleAll}
              >
                {allExpanded ? "Collapse All" : "Expand All"}
              </Button>
            </div>
          </div>
        </div>

        {/* Pipeline content */}
        <div className="p-6 max-w-4xl mx-auto space-y-5">
          {/* Query display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">User Query</p>
            <p className="text-sm font-medium text-foreground">{trace.query}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Project: <strong className="text-foreground">{trace.project}</strong></span>
              <span>Model: <strong className="text-foreground font-mono">{trace.model}</strong></span>
              <span>{new Date(trace.timestamp).toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Summary bar */}
          <TraceSummaryBar trace={trace} />

          {/* Timeline */}
          <TraceTimeline trace={trace} />

          {/* Pipeline DAG */}
          <div className="space-y-0">
            <PipelineStatusBadge status={trace.status} position="top" />

            {trace.nodes.map((node, i) => (
              <div key={node.id}>
                {i > 0 && <PipelineConnector status={trace.nodes[i - 1].status} />}
                <PipelineNode
                  node={node}
                  isExpanded={expandedNodes.has(node.id)}
                  onToggle={() => toggleNode(node.id)}
                  index={i}
                />
              </div>
            ))}

            <PipelineStatusBadge status={trace.status} position="bottom" />
          </div>
        </div>
      </main>
    </div>
  )
}
