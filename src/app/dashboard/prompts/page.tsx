"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, MessageSquare, Copy, Check, Trash2, Edit2, X, Sparkles, Loader2 } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { toast } from "sonner"
import { formatRelativeTime } from "@/lib/utils"

const initialPrompts = [
  { id: "pr-1", name: "Medical Assistant Persona", version: "1.2", category: "System", content: "You are a highly knowledgeable medical assistant...", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "pr-2", name: "RAG QA Template", version: "2.0", category: "Template", content: "Use the following context to answer the user's question:\n\n<context>\n{{context}}\n</context>\n\nQuestion: {{question}}", createdAt: new Date(Date.now() - 172800000).toISOString() },
]

export default function PromptsPage() {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<typeof initialPrompts[0] | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const [formData, setFormData] = useState({ name: "", category: "System", content: "" })

  useEffect(() => {
    const saved = localStorage.getItem("ragaai_prompts")
    if (saved) {
      try { setPrompts(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const savePrompts = (newPrompts: typeof initialPrompts) => {
    setPrompts(newPrompts)
    localStorage.setItem("ragaai_prompts", JSON.stringify(newPrompts))
  }

  const filtered = prompts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    toast.success("Prompt copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const topic = formData.name || "a helpful AI assistant"
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })
      
      if (!res.ok) throw new Error("Failed to generate")
      
      const data = await res.json()
      
      setFormData(p => ({
        ...p,
        content: data.text
      }))
      toast.success("Prompt generated using AI")
    } catch (e) {
      toast.error("Failed to generate prompt")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error("Name and content are required")
      return
    }

    if (editingPrompt) {
      savePrompts(prompts.map(p => p.id === editingPrompt.id ? { ...p, ...formData, version: (parseFloat(p.version) + 0.1).toFixed(1) } : p))
      toast.success("Prompt updated")
    } else {
      savePrompts([{
        id: `pr-${Date.now()}`,
        ...formData,
        version: "1.0",
        createdAt: new Date().toISOString()
      }, ...prompts])
      toast.success("Prompt created")
    }
    
    setCreateOpen(false)
    setEditingPrompt(null)
    setFormData({ name: "", category: "System", content: "" })
  }

  const handleDelete = (id: string) => {
    savePrompts(prompts.filter(p => p.id !== id))
    toast.success("Prompt deleted")
  }

  const openEdit = (prompt: typeof initialPrompts[0]) => {
    setEditingPrompt(prompt)
    setFormData({ name: prompt.name, category: prompt.category, content: prompt.content })
    setCreateOpen(true)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Prompt Library" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts..."
              className="w-full pl-8 pr-4 h-9 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button icon={<Plus className="w-3.5 h-3.5" />} onClick={() => { setEditingPrompt(null); setFormData({ name: "", category: "System", content: "" }); setCreateOpen(true); }}>
            New Prompt
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((prompt, i) => (
            <motion.div key={prompt.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        {prompt.name}
                        <Badge variant="outline" className="text-[10px]">v{prompt.version}</Badge>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{prompt.category} • {formatRelativeTime(prompt.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleCopy(prompt.id, prompt.content)} className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      {copiedId === prompt.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(prompt)} className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(prompt.id)} className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-xs font-mono text-muted-foreground whitespace-pre-wrap flex-1">
                  {prompt.content.length > 200 ? `${prompt.content.substring(0, 200)}...` : prompt.content}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        <Dialog.Root open={createOpen} onOpenChange={setCreateOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-2xl z-50 shadow-2xl flex flex-col max-h-[90vh]">
              <Dialog.Title className="text-lg font-semibold text-foreground">
                {editingPrompt ? "Edit Prompt" : "New Prompt"}
              </Dialog.Title>
              <div className="mt-5 space-y-4 flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Name</label>
                    <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Prompt Name"
                      className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Category</label>
                    <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      {["System", "Template", "Few-Shot", "Guardrail"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">Content</label>
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="text-xs flex items-center gap-1 text-amber-500 hover:text-amber-600 transition-colors disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      Auto-Generate with AI
                    </button>
                  </div>
                  <textarea value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} placeholder="Write your prompt here. Use {{vars}} for variables."
                    className="w-full p-3 rounded-md border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px] resize-y" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-border">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>{editingPrompt ? "Save Changes" : "Create Prompt"}</Button>
              </div>
              <Dialog.Close asChild><button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button></Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </main>
    </div>
  )
}
