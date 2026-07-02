"use client"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Download, RefreshCw, ChevronRight, ChevronLeft, X } from "lucide-react"
import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"
import { Badge, StatusBadge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { formatLatency, formatCost, formatRelativeTime, cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Trace } from "@/types"

const generateTraces = (): Trace[] =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `trace-${i + 1}`,
    projectName: ["Medical-RAG", "CustomerSupport", "LegalDoc-AI", "CodeAssist"][i % 4],
    datasetName: `Dataset-v${(i % 3) + 1}`,
    tracerType: (["langchain", "llamaindex", "openai", "agentic", "custom"] as const)[i % 5],
    startTime: new Date(Date.now() - i * 300000).toISOString(),
    endTime: new Date(Date.now() - i * 300000 + 2000 + Math.random() * 5000).toISOString(),
    duration: 2000 + Math.random() * 5000,
    status: (["completed", "completed", "completed", "failed", "active"] as const)[i % 5],
    spans: [],
    tokenUsage: { promptTokens: 800 + i * 50, completionTokens: 200 + i * 20, totalTokens: 1000 + i * 70 },
    cost: 0.001 + Math.random() * 0.01,
    model: ["gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet", "gemini-1.5-pro"][i % 4],
  }))

export default function TracesPage() {
  const router = useRouter()
  const [traces, setTraces] = useState<Trace[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({ status: "all", tracer: "all", model: "all" })
  const perPage = 10

  // Load or generate initial traces
  useEffect(() => {
    const saved = localStorage.getItem("ragaai_traces")
    if (saved) {
      try { setTraces(JSON.parse(saved)) } catch (e) {}
    } else {
      const initial = generateTraces()
      setTraces(initial)
      localStorage.setItem("ragaai_traces", JSON.stringify(initial))
    }
  }, [])

  const saveTraces = (newTraces: Trace[]) => {
    setTraces(newTraces)
    localStorage.setItem("ragaai_traces", JSON.stringify(newTraces))
  }

  const filtered = useMemo(() => {
    return traces.filter((t) => {
      const matchSearch = t.projectName.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        (t.model ?? "").toLowerCase().includes(search.toLowerCase())
      const matchStatus = filters.status === "all" || t.status === filters.status
      const matchTracer = filters.tracer === "all" || t.tracerType === filters.tracer
      const matchModel = filters.model === "all" || t.model === filters.model
      return matchSearch && matchStatus && matchTracer && matchModel
    })
  }, [traces, search, filters])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      // Simulate 3 new incoming traces
      const newTraces = generateTraces().slice(0, 3).map(t => ({...t, id: `trace-${Date.now()}-${Math.floor(Math.random()*1000)}`}))
      saveTraces([...newTraces, ...traces])
      setRefreshing(false)
      toast.success("3 new traces received")
    }, 500)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `traces-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filtered.length} traces`)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Traces" />
      <main className="flex-1 overflow-hidden flex flex-col p-6 gap-4">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search traces, projects, models..."
              className="w-full pl-8 pr-4 h-9 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Button variant="outline" size="sm" icon={<Filter className="w-3.5 h-3.5" />} onClick={() => setFilterOpen(!filterOpen)}>
              Filter
              {(filters.status !== "all" || filters.tracer !== "all" || filters.model !== "all") && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Button>
            <AnimatePresence>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setFilterOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-xl shadow-2xl z-40 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Filters</h4>
                      <button onClick={() => { setFilters({ status: "all", tracer: "all", model: "all" }); setPage(1) }} className="text-xs text-primary hover:underline">Reset</button>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Status</label>
                      <select value={filters.status} onChange={(e) => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1) }}
                        className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="active">Active</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Tracer Type</label>
                      <select value={filters.tracer} onChange={(e) => { setFilters(f => ({ ...f, tracer: e.target.value })); setPage(1) }}
                        className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="all">All</option>
                        {["langchain", "llamaindex", "openai", "agentic", "custom"].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Model</label>
                      <select value={filters.model} onChange={(e) => { setFilters(f => ({ ...f, model: e.target.value })); setPage(1) }}
                        className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="all">All</option>
                        {["gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet", "gemini-1.5-pro"].map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={handleExport}>Export</Button>
          <Button variant="outline" size="sm" icon={<RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />} onClick={handleRefresh} loading={refreshing}>Refresh</Button>
        </div>

        {/* Table */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card border-b border-border">
                <tr>
                  {["Trace ID", "Project", "Model", "Type", "Duration", "Tokens", "Cost", "Status", "Time", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((trace, i) => (
                  <motion.tr
                    key={trace.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/traces/${trace.id}`)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{trace.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{trace.projectName}</td>
                    <td className="px-4 py-3"><span className="font-mono text-xs bg-muted px-2 py-1 rounded">{trace.model}</span></td>
                    <td className="px-4 py-3"><Badge variant="outline">{trace.tracerType}</Badge></td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{trace.duration ? formatLatency(trace.duration) : "—"}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{trace.tokenUsage?.totalTokens.toLocaleString()}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{trace.cost ? formatCost(trace.cost) : "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={trace.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatRelativeTime(trace.startTime)}</td>
                    <td className="px-4 py-3"><ChevronRight className="w-4 h-4 text-muted-foreground" /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} traces</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} icon={<ChevronLeft className="w-3 h-3" />}>Prev</Button>
              <span className="text-xs font-medium">Page {page} of {totalPages || 1}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} icon={<ChevronRight className="w-3 h-3" />}>Next</Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
