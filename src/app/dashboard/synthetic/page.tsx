"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Sparkles, X, Loader2, Play } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge, StatusBadge } from "@/components/ui/Badge"
import { toast } from "sonner"

const initialJobs = [
  { id: "syn-1", name: "Medical Edge Cases", datasetName: "MedicalQA-v4-synth", size: 500, type: "Q&A Pairs", status: "completed", progress: 100 },
  { id: "syn-2", name: "Toxic Prompt Injection", datasetName: "SecurityTest-v1", size: 1000, type: "Adversarial", status: "running", progress: 45 },
]

export default function SyntheticDataPage() {
  const [jobs, setJobs] = useState(initialJobs)
  const [createOpen, setCreateOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", type: "Q&A Pairs", size: "100", context: "" })

  useEffect(() => {
    const saved = localStorage.getItem("ragaai_synthetic")
    if (saved) {
      try { setJobs(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const saveJobs = (newJobs: typeof initialJobs) => {
    setJobs(newJobs)
    localStorage.setItem("ragaai_synthetic", JSON.stringify(newJobs))
  }

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error("Job name is required")
      return
    }

    const newJob = {
      id: `syn-${Date.now()}`,
      name: formData.name,
      datasetName: `${formData.name.replace(/\s+/g, '')}-synth`,
      size: parseInt(formData.size) || 100,
      type: formData.type,
      status: "running" as const,
      progress: 0
    }
    
    saveJobs([newJob, ...jobs])
    setCreateOpen(false)
    setFormData({ name: "", type: "Q&A Pairs", size: "100", context: "" })
    toast.success("Synthetic generation job started")

    // Mock progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setJobs(prev => {
        const nextState = prev.map(j => j.id === newJob.id ? { ...j, progress: Math.min(progress, 100), status: progress >= 100 ? "completed" : "running" } : j)
        if (progress >= 100) localStorage.setItem("ragaai_synthetic", JSON.stringify(nextState))
        return nextState
      })
      if (progress >= 100) {
        clearInterval(interval)
        toast.success(`Job ${newJob.name} completed successfully`)
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Synthetic Data Generation" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-end">
          <Button icon={<Sparkles className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)}>Generate Data</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{job.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Target: {job.datasetName}</p>
                    </div>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <Badge variant="outline">{job.type}</Badge>
                  <span>{job.size} samples</span>
                </div>

                {job.status === "running" ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Generating...</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${job.progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="w-full text-xs">View Dataset</Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create Modal */}
        <Dialog.Root open={createOpen} onOpenChange={setCreateOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-lg z-50 shadow-2xl flex flex-col max-h-[90vh]">
              <Dialog.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> New Generation Job
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">Generate synthetic data using LLMs for testing and evaluation.</Dialog.Description>
              
              <div className="mt-5 space-y-4 flex-1 overflow-y-auto pr-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Job Name</label>
                  <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Finance Edge Cases"
                    className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Type</label>
                    <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      {["Q&A Pairs", "Conversations", "Adversarial", "Summaries"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Size (Rows)</label>
                    <input type="number" value={formData.size} onChange={e => setFormData(p => ({ ...p, size: e.target.value }))}
                      className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Context / Seed Prompt</label>
                  <textarea value={formData.context} onChange={e => setFormData(p => ({ ...p, context: e.target.value }))} placeholder="Provide context, topics, or instructions for generation..."
                    className="w-full p-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-border">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} icon={<Play className="w-4 h-4"/>}>Start Generation</Button>
              </div>
              <Dialog.Close asChild><button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button></Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </main>
    </div>
  )
}
