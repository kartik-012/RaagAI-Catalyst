"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Plus, FolderKanban, Trash2, GitBranch, Database, X } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cn, formatRelativeTime } from "@/lib/utils"
import { toast } from "sonner"
import type { Project } from "@/types"

const colors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-violet-500"]
const useCases = ["Q&A", "Chatbot", "Summarization", "Code Generation", "RAG"]

const initialProjects: Project[] = [
  { id: "p1", name: "Medical-RAG", usecase: "RAG", description: "Medical knowledge base Q&A", createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), updatedAt: new Date(Date.now() - 3600000).toISOString(), tracesCount: 1204, datasetsCount: 8, status: "active" },
  { id: "p2", name: "CustomerSupport", usecase: "Chatbot", description: "Customer support automation", createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), updatedAt: new Date(Date.now() - 7200000).toISOString(), tracesCount: 3420, datasetsCount: 12, status: "active" },
  { id: "p3", name: "LegalDoc-AI", usecase: "Summarization", description: "Legal document analysis", createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), updatedAt: new Date(Date.now() - 14400000).toISOString(), tracesCount: 567, datasetsCount: 4, status: "active" },
  { id: "p4", name: "CodeAssist", usecase: "Code Generation", description: "AI-powered code assistant", createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), updatedAt: new Date(Date.now() - 28800000).toISOString(), tracesCount: 892, datasetsCount: 6, status: "active" },
  { id: "p5", name: "FinanceQA", usecase: "Q&A", description: "Financial analysis Q&A", createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), updatedAt: new Date(Date.now() - 43200000).toISOString(), tracesCount: 340, datasetsCount: 3, status: "active" },
  { id: "p6", name: "ResearchBot", usecase: "RAG", description: "Academic research assistant", createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(), tracesCount: 120, datasetsCount: 2, status: "active" },
]

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [newProject, setNewProject] = useState({ name: "", usecase: "RAG" })

  useEffect(() => {
    const saved = localStorage.getItem("ragaai_projects")
    if (saved) {
      try { setProjects(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects)
    localStorage.setItem("ragaai_projects", JSON.stringify(newProjects))
  }

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = () => {
    if (!newProject.name.trim()) { toast.error("Project name is required"); return }
    if (projects.some(p => p.name.toLowerCase() === newProject.name.trim().toLowerCase())) { toast.error("Project already exists"); return }
    const project: Project = {
      id: `p${Date.now()}`, name: newProject.name.trim(), usecase: newProject.usecase,
      description: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      tracesCount: 0, datasetsCount: 0, status: "active",
    }
    saveProjects([project, ...projects])
    setNewProject({ name: "", usecase: "RAG" })
    setCreateOpen(false)
    toast.success(`Project "${project.name}" created`)
  }

  const handleDelete = () => {
    if (!deleteId) return
    const name = projects.find(p => p.id === deleteId)?.name
    saveProjects(projects.filter(p => p.id !== deleteId))
    setDeleteId(null)
    toast.success(`Project "${name}" deleted`)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Projects" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
              className="w-full pl-8 pr-4 h-9 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)}>New Project</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover className="p-5 group relative" onClick={() => router.push("/dashboard/traces")}>
                <button onClick={e => { e.stopPropagation(); setDeleteId(project.id) }}
                  className="absolute top-3 right-3 w-7 h-7 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-start gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", colors[i % colors.length])}>
                    <FolderKanban className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm text-foreground">{project.name}</h3>
                    <Badge variant="outline" className="mt-1">{project.usecase}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{project.tracesCount} traces</span>
                  <span className="flex items-center gap-1"><Database className="w-3 h-3" />{project.datasetsCount} datasets</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Updated {formatRelativeTime(project.updatedAt)}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create Modal */}
        <Dialog.Root open={createOpen} onOpenChange={setCreateOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-md z-50 shadow-2xl">
              <Dialog.Title className="text-lg font-semibold text-foreground">New Project</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">Create a new LLM project to start tracing.</Dialog.Description>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Project Name</label>
                  <input value={newProject.name} onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Medical-RAG"
                    className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={e => e.key === "Enter" && handleCreate()} autoFocus />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Use Case</label>
                  <select value={newProject.usecase} onChange={e => setNewProject(p => ({ ...p, usecase: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    {useCases.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate}>Create Project</Button>
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
              <Dialog.Title className="text-lg font-semibold text-foreground">Delete Project</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">This action cannot be undone. All traces and datasets in this project will be lost.</Dialog.Description>
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
