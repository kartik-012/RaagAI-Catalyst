"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, FlaskConical, Play, X, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, Scale } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge, StatusBadge } from "@/components/ui/Badge"
import { formatRelativeTime, cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Evaluation } from "@/types"

const initialEvaluations = [
  { id: "eval-1", projectName: "Medical-RAG", datasetName: "MedicalQA-v3", metrics: [{ name: "Faithfulness", score: 0.94, status: "passed" }, { name: "Hallucination", score: 0.02, status: "passed" }], status: "completed", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "eval-2", projectName: "CustomerSupport", datasetName: "CustomerTickets-v2", metrics: [{ name: "Relevance", score: 0.88, status: "passed" }, { name: "Toxicity", score: 0.15, status: "failed" }], status: "completed", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "eval-3", projectName: "LegalDoc-AI", datasetName: "LegalContracts-v1", metrics: [{ name: "Faithfulness", score: 0.91, status: "passed" }, { name: "Coherence", score: 0.95, status: "passed" }], status: "running", createdAt: new Date().toISOString() },
]

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState(initialEvaluations)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const [newEval, setNewEval] = useState({ dataset: "MedicalQA-v3", metrics: ["Faithfulness"], model: "gpt-4o" })
  const availableMetrics = ["Faithfulness", "Hallucination", "Relevance", "Coherence", "Toxicity", "PII"]

  useEffect(() => {
    const saved = localStorage.getItem("ragaai_evaluations")
    if (saved) {
      try { setEvaluations(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const saveEvaluations = (newEvals: typeof initialEvaluations) => {
    setEvaluations(newEvals)
    localStorage.setItem("ragaai_evaluations", JSON.stringify(newEvals))
  }

  const filtered = evaluations.filter(e => e.projectName.toLowerCase().includes(search.toLowerCase()) || e.datasetName.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = () => {
    if (newEval.metrics.length === 0) { toast.error("Select at least one metric"); return }
    const ev = {
      id: `eval-${Date.now()}`, projectName: "Medical-RAG", datasetName: newEval.dataset,
      metrics: newEval.metrics.map(m => ({ name: m, score: 0, status: "pending" })),
      status: "running" as const, createdAt: new Date().toISOString(),
    }
    const updated = [ev, ...evaluations]
    saveEvaluations(updated)
    setCreateOpen(false)
    toast.success("Evaluation started")
    
    // Mock completion
    setTimeout(() => {
      setEvaluations(prev => {
        const completed = prev.map(p => p.id === ev.id ? { 
          ...p, 
          status: "completed", 
          metrics: p.metrics.map(m => ({ ...m, score: Math.random() * 0.5 + 0.5, status: Math.random() > 0.8 ? "failed" : "passed" })) 
        } : p)
        localStorage.setItem("ragaai_evaluations", JSON.stringify(completed))
        return completed
      })
      toast.success("Evaluation completed")
    }, 3000)
  }

  const handleRerun = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = evaluations.map(p => p.id === id ? { ...p, status: "running" as const } : p)
    saveEvaluations(updated)
    toast.success("Re-running evaluation...")
    setTimeout(() => {
      setEvaluations(prev => {
        const completed = prev.map(p => p.id === id ? { 
          ...p, 
          status: "completed",
          metrics: p.metrics.map(m => ({ ...m, score: Math.random() * 0.5 + 0.5, status: Math.random() > 0.8 ? "failed" : "passed" })) 
        } : p)
        localStorage.setItem("ragaai_evaluations", JSON.stringify(completed))
        return completed
      })
      toast.success("Evaluation completed")
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Evaluations" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search evaluations..."
              className="w-full pl-8 pr-4 h-9 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)}>New Evaluation</Button>
        </div>

        <div className="space-y-3">
          {filtered.map((ev, i) => (
            <motion.div key={ev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden">
                <div onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                  className="flex items-center p-4 cursor-pointer hover:bg-muted/30 transition-colors gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-5 h-5 text-violet-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-foreground">{ev.id}</h3>
                      <StatusBadge status={ev.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{ev.projectName} • {ev.datasetName}</p>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-2">
                    {ev.metrics.map(m => (
                      <Badge key={m.name} variant={m.status === "passed" ? "success" : m.status === "failed" ? "error" : "outline"} className="text-[10px]">
                        {m.name}: {m.score.toFixed(2)}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" icon={<Play className="w-3.5 h-3.5" />} 
                      onClick={(e) => handleRerun(e, ev.id)} loading={ev.status === "running"}
                      className="h-8">Re-run</Button>
                    {expandedId === ev.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === ev.id && (
                  <div className="border-t border-border bg-muted/10 p-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Metric Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ev.metrics.map(m => (
                        <div key={m.name} className="bg-background rounded-lg border border-border p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {m.status === "passed" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                             m.status === "failed" ? <AlertTriangle className="w-4 h-4 text-red-500" /> : 
                             <Scale className="w-4 h-4 text-muted-foreground" />}
                            <span className="text-sm font-medium">{m.name}</span>
                          </div>
                          <span className={cn("text-sm font-bold font-mono", 
                            m.status === "passed" ? "text-emerald-500" : m.status === "failed" ? "text-red-500" : "text-muted-foreground"
                          )}>
                            {m.score.toFixed(3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create Modal */}
        <Dialog.Root open={createOpen} onOpenChange={setCreateOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-md z-50 shadow-2xl">
              <Dialog.Title className="text-lg font-semibold text-foreground">New Evaluation</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">Run metrics against a dataset.</Dialog.Description>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Dataset</label>
                  <select value={newEval.dataset} onChange={e => setNewEval(p => ({ ...p, dataset: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {["MedicalQA-v3", "CustomerTickets-v2", "LegalContracts-v1"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Model to Evaluate</label>
                  <select value={newEval.model} onChange={e => setNewEval(p => ({ ...p, model: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {["gpt-4o", "gpt-4-turbo", "claude-3-5-sonnet", "gemini-1.5-pro"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">Metrics</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableMetrics.map(m => (
                      <label key={m} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-1.5 rounded-md">
                        <input type="checkbox" checked={newEval.metrics.includes(m)}
                          onChange={(e) => {
                            if (e.target.checked) setNewEval(p => ({ ...p, metrics: [...p.metrics, m] }))
                            else setNewEval(p => ({ ...p, metrics: p.metrics.filter(x => x !== m) }))
                          }}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate}>Start Evaluation</Button>
                </div>
              </div>
              <Dialog.Close asChild><button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button></Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </main>
    </div>
  )
}
