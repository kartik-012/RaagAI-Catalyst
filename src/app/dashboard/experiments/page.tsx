"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Activity, Trash2, X } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Topbar } from "@/components/layout/Topbar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { toast } from "sonner"

const initialExperiments = [
  { id: "exp-1", name: "Model Comparison: GPT-4o vs Claude 3.5", dataset: "MedicalQA-v3", variants: [
      { name: "Variant A (GPT-4o)", model: "gpt-4o", prompt: "v1.2", scores: { faithfulness: 0.94, relevance: 0.91, latency: 1240, cost: 0.008 } },
      { name: "Variant B (Claude 3.5)", model: "claude-3-5-sonnet", prompt: "v1.2", scores: { faithfulness: 0.96, relevance: 0.89, latency: 980, cost: 0.006 } }
    ], status: "completed"
  },
]

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState(initialExperiments)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  
  const [newExp, setNewExp] = useState({ name: "", dataset: "MedicalQA-v3", modelA: "gpt-4o", modelB: "claude-3-5-sonnet" })

  useEffect(() => {
    const saved = localStorage.getItem("ragaai_experiments")
    if (saved) {
      try { setExperiments(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const saveExperiments = (newExps: typeof initialExperiments) => {
    setExperiments(newExps)
    localStorage.setItem("ragaai_experiments", JSON.stringify(newExps))
  }

  const handleCreate = () => {
    if (!newExp.name.trim()) { toast.error("Experiment name is required"); return }
    const exp = {
      id: `exp-${Date.now()}`, name: newExp.name.trim(), dataset: newExp.dataset,
      variants: [
        { name: `Variant A (${newExp.modelA})`, model: newExp.modelA, prompt: "v1.0", scores: { faithfulness: Math.random() * 0.2 + 0.7, relevance: Math.random() * 0.2 + 0.7, latency: Math.floor(Math.random() * 1000) + 500, cost: Math.random() * 0.01 } },
        { name: `Variant B (${newExp.modelB})`, model: newExp.modelB, prompt: "v1.0", scores: { faithfulness: Math.random() * 0.2 + 0.7, relevance: Math.random() * 0.2 + 0.7, latency: Math.floor(Math.random() * 1000) + 500, cost: Math.random() * 0.01 } }
      ],
      status: "completed"
    }
    saveExperiments([exp, ...experiments])
    setCreateOpen(false)
    setNewExp({ name: "", dataset: "MedicalQA-v3", modelA: "gpt-4o", modelB: "claude-3-5-sonnet" })
    toast.success("Experiment created")
  }

  const handleDelete = () => {
    if (!deleteId) return
    saveExperiments(experiments.filter(e => e.id !== deleteId))
    setDeleteId(null)
    toast.success("Experiment deleted")
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Experiments" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-end">
          <Button icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)}>New Experiment</Button>
        </div>

        <div className="space-y-6">
          {experiments.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-pink-500" />
                    </div>
                    <div>
                      <CardTitle>{exp.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">Dataset: {exp.dataset}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Completed</Badge>
                    <button onClick={() => setDeleteId(exp.id)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x divide-border">
                    {exp.variants.map((variant, vIdx) => {
                      const otherVariant = exp.variants[vIdx === 0 ? 1 : 0]
                      const isWinner = (metric: keyof typeof variant.scores) => {
                        if (metric === "latency" || metric === "cost") return variant.scores[metric] < otherVariant.scores[metric]
                        return variant.scores[metric] > otherVariant.scores[metric]
                      }
                      
                      return (
                        <div key={variant.name} className="p-5">
                          <h4 className="font-semibold text-sm mb-4">{variant.name}</h4>
                          <div className="space-y-3">
                            {Object.entries(variant.scores).map(([metric, value]) => (
                              <div key={metric} className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground capitalize">{metric}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm font-medium">
                                    {metric === "latency" ? `${value.toFixed(0)}ms` : metric === "cost" ? `$${value.toFixed(4)}` : value.toFixed(3)}
                                  </span>
                                  {isWinner(metric as any) && <Badge variant="success" className="px-1.5 py-0 text-[10px]">Winner</Badge>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create Modal */}
        <Dialog.Root open={createOpen} onOpenChange={setCreateOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-md z-50 shadow-2xl">
              <Dialog.Title className="text-lg font-semibold text-foreground">New Experiment</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">Compare models or prompts A/B style.</Dialog.Description>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Experiment Name</label>
                  <input value={newExp.name} onChange={e => setNewExp(p => ({ ...p, name: e.target.value }))} placeholder="e.g. GPT-4 vs Claude 3"
                    className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" autoFocus />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Dataset</label>
                  <select value={newExp.dataset} onChange={e => setNewExp(p => ({ ...p, dataset: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {["MedicalQA-v3", "CustomerTickets-v2"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Model A</label>
                    <select value={newExp.modelA} onChange={e => setNewExp(p => ({ ...p, modelA: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {["gpt-4o", "gpt-4-turbo", "claude-3-5-sonnet", "gemini-1.5-pro"].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Model B</label>
                    <select value={newExp.modelB} onChange={e => setNewExp(p => ({ ...p, modelB: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {["gpt-4o", "gpt-4-turbo", "claude-3-5-sonnet", "gemini-1.5-pro"].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate}>Run Experiment</Button>
                </div>
              </div>
              <Dialog.Close asChild><button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button></Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Confirmation */}
        <Dialog.Root open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-sm z-50 shadow-2xl">
              <Dialog.Title className="text-lg font-semibold text-foreground">Delete Experiment</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">This action cannot be undone.</Dialog.Description>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </main>
    </div>
  )
}
