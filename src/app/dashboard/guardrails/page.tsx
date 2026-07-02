"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Shield, ShieldAlert, ToggleLeft, ToggleRight, Trash2, Edit2, CheckCircle2, ShieldBan, X } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const initialGuardrails = [
  { id: "gr-1", name: "Toxicity Filter", type: "Input & Output", action: "Block", threshold: 0.8, enabled: true, hits: 142 },
  { id: "gr-2", name: "PII Redaction", type: "Output", action: "Redact", threshold: 0.9, enabled: true, hits: 89 },
  { id: "gr-3", name: "Competitor Mention", type: "Output", action: "Warn", threshold: 0.7, enabled: false, hits: 12 },
  { id: "gr-4", name: "Prompt Injection", type: "Input", action: "Block", threshold: 0.85, enabled: true, hits: 34 },
]

export default function GuardrailsPage() {
  const [guardrails, setGuardrails] = useState(initialGuardrails)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", type: "Input & Output", action: "Block", threshold: "0.8" })

  useEffect(() => {
    const saved = localStorage.getItem("ragaai_guardrails")
    if (saved) {
      try { setGuardrails(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const saveGuardrails = (newGuardrails: typeof initialGuardrails) => {
    setGuardrails(newGuardrails)
    localStorage.setItem("ragaai_guardrails", JSON.stringify(newGuardrails))
  }

  const filtered = guardrails.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))

  const toggleEnabled = (id: string) => {
    saveGuardrails(guardrails.map(g => {
      if (g.id === id) {
        toast.success(`Guardrail ${g.enabled ? 'disabled' : 'enabled'}`)
        return { ...g, enabled: !g.enabled }
      }
      return g
    }))
  }

  const handleDelete = (id: string) => {
    saveGuardrails(guardrails.filter(g => g.id !== id))
    toast.success("Guardrail deleted")
  }

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required")
      return
    }
    saveGuardrails([{
      id: `gr-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      action: formData.action,
      threshold: parseFloat(formData.threshold) || 0.8,
      enabled: true,
      hits: 0
    }, ...guardrails])
    setCreateOpen(false)
    setFormData({ name: "", type: "Input & Output", action: "Block", threshold: "0.8" })
    toast.success("Guardrail created")
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Guardrails" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guardrails..."
              className="w-full pl-8 pr-4 h-9 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)}>New Guardrail</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((gr, i) => (
            <motion.div key={gr.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={cn("p-5 h-full flex flex-col transition-opacity", !gr.enabled && "opacity-60 grayscale-[50%]")}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", gr.enabled ? "bg-orange-500/10 text-orange-500" : "bg-muted text-muted-foreground")}>
                      {gr.action === "Block" ? <ShieldBan className="w-5 h-5" /> : gr.action === "Warn" ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{gr.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{gr.type}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleEnabled(gr.id)} className="text-muted-foreground hover:text-foreground transition-colors outline-none">
                    {gr.enabled ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </div>
                
                <div className="mt-auto pt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">Action: <Badge variant="outline" className="text-[10px]">{gr.action}</Badge></span>
                    <span>Threshold: <strong className="text-foreground">{gr.threshold}</strong></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground"><strong className="text-foreground">{gr.hits}</strong> events triggered</span>
                    <button onClick={() => handleDelete(gr.id)} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors outline-none">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create Modal */}
        <Dialog.Root open={createOpen} onOpenChange={setCreateOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-md z-50 shadow-2xl">
              <Dialog.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" /> New Guardrail
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">Setup real-time checks for inputs and outputs.</Dialog.Description>
              
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Rule Name</label>
                  <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Tone Checker"
                    className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Evaluation Phase</label>
                  <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    {["Input", "Output", "Input & Output"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Action</label>
                    <select value={formData.action} onChange={e => setFormData(p => ({ ...p, action: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      {["Block", "Warn", "Redact", "Log"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Sensitivity Threshold</label>
                    <input type="number" step="0.1" min="0" max="1" value={formData.threshold} onChange={e => setFormData(p => ({ ...p, threshold: e.target.value }))}
                      className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-border">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create Guardrail</Button>
              </div>
              <Dialog.Close asChild><button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button></Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </main>
    </div>
  )
}
