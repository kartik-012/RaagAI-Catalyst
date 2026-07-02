"use client"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Upload, Database, Trash2, Eye, X, FileSpreadsheet, Loader2 } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge, StatusBadge } from "@/components/ui/Badge"
import { formatRelativeTime } from "@/lib/utils"
import { toast } from "sonner"
import type { Dataset } from "@/types"

const initialDatasets: Dataset[] = [
  { id: "d1", name: "MedicalQA-v3", projectId: "p1", projectName: "Medical-RAG", rowCount: 2400, columnCount: 8, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), schema: { prompt: "string", context: "string", response: "string", ground_truth: "string" }, status: "ready" },
  { id: "d2", name: "CustomerTickets-v2", projectId: "p2", projectName: "CustomerSupport", rowCount: 5600, columnCount: 12, createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), schema: { query: "string", category: "string", response: "string", satisfaction: "number" }, status: "ready" },
  { id: "d3", name: "LegalContracts-v1", projectId: "p3", projectName: "LegalDoc-AI", rowCount: 890, columnCount: 6, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), schema: { document: "string", summary: "string", clauses: "array" }, status: "ready" },
  { id: "d4", name: "CodeExamples-v1", projectId: "p4", projectName: "CodeAssist", rowCount: 3200, columnCount: 5, createdAt: new Date(Date.now() - 86400000).toISOString(), schema: { prompt: "string", code: "string", language: "string" }, status: "processing" },
  { id: "d5", name: "FinanceReports-v1", projectId: "p5", projectName: "FinanceQA", rowCount: 1500, columnCount: 7, createdAt: new Date(Date.now() - 43200000).toISOString(), schema: { question: "string", answer: "string", source: "string" }, status: "ready" },
]

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState(initialDatasets)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newDataset, setNewDataset] = useState({ name: "", projectName: "Medical-RAG", rowCount: "100" })
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("ragaai_datasets")
    if (saved) {
      try { setDatasets(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const saveDatasets = (newDatasets: Dataset[]) => {
    setDatasets(newDatasets)
    localStorage.setItem("ragaai_datasets", JSON.stringify(newDatasets))
  }

  const filtered = datasets.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.projectName.toLowerCase().includes(search.toLowerCase()))

  const handleUpload = () => {
    fileRef.current?.click()
  }

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setUploading(false)
          const ds: Dataset = {
            id: `d${Date.now()}`, name: file.name.replace(/\.\w+$/, ""), projectId: "p1",
            projectName: "Medical-RAG", rowCount: Math.floor(Math.random() * 5000) + 100,
            columnCount: Math.floor(Math.random() * 10) + 3, createdAt: new Date().toISOString(),
            schema: { col1: "string", col2: "string", col3: "number" }, status: "ready",
          }
          setDatasets(prev => {
            const updated = [ds, ...prev]
            localStorage.setItem("ragaai_datasets", JSON.stringify(updated))
            return updated
          })
          toast.success(`"${ds.name}" uploaded successfully`)
          return 0
        }
        return p + 10
      })
    }, 200)
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleCreate = () => {
    if (!newDataset.name.trim()) { toast.error("Dataset name is required"); return }
    const ds: Dataset = {
      id: `d${Date.now()}`, name: newDataset.name.trim(), projectId: "p1",
      projectName: newDataset.projectName, rowCount: parseInt(newDataset.rowCount) || 0,
      columnCount: 5, createdAt: new Date().toISOString(),
      schema: { prompt: "string", response: "string", context: "string" }, status: "ready",
    }
    saveDatasets([ds, ...datasets])
    setNewDataset({ name: "", projectName: "Medical-RAG", rowCount: "100" })
    setCreateOpen(false)
    toast.success(`Dataset "${ds.name}" created`)
  }

  const handleDelete = () => {
    if (!deleteId) return
    const name = datasets.find(d => d.id === deleteId)?.name
    saveDatasets(datasets.filter(d => d.id !== deleteId))
    setDeleteId(null)
    toast.success(`Dataset "${name}" deleted`)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Datasets" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <input ref={fileRef} type="file" accept=".csv,.json,.xlsx" className="hidden" onChange={onFileSelected} />

        {uploading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-medium text-foreground">Uploading file...</span>
              <span className="text-xs text-muted-foreground ml-auto">{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${uploadProgress}%` }} />
            </div>
          </motion.div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search datasets..."
              className="w-full pl-8 pr-4 h-9 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button variant="outline" icon={<Upload className="w-3.5 h-3.5" />} onClick={handleUpload}>Upload CSV</Button>
          <Button icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)}>New Dataset</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ds, i) => (
            <motion.div key={ds.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 group relative hover:shadow-md transition-shadow">
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setPreviewDataset(ds)} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"><Eye className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteId(ds.id)} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-foreground">{ds.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{ds.projectName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span>{ds.rowCount.toLocaleString()} rows</span>
                  <span>{ds.columnCount} columns</span>
                  <StatusBadge status={ds.status} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Created {formatRelativeTime(ds.createdAt)}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create Modal */}
        <Dialog.Root open={createOpen} onOpenChange={setCreateOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-md z-50 shadow-2xl">
              <Dialog.Title className="text-lg font-semibold text-foreground">New Dataset</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">Create an empty dataset for evaluation.</Dialog.Description>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Name</label>
                  <input value={newDataset.name} onChange={e => setNewDataset(p => ({ ...p, name: e.target.value }))} placeholder="e.g. MedicalQA-v4"
                    className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" autoFocus />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Project</label>
                  <select value={newDataset.projectName} onChange={e => setNewDataset(p => ({ ...p, projectName: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    {["Medical-RAG", "CustomerSupport", "LegalDoc-AI", "CodeAssist", "FinanceQA"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Row Count</label>
                  <input type="number" value={newDataset.rowCount} onChange={e => setNewDataset(p => ({ ...p, rowCount: e.target.value }))}
                    className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate}>Create Dataset</Button>
                </div>
              </div>
              <Dialog.Close asChild><button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button></Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Schema Preview */}
        <Dialog.Root open={!!previewDataset} onOpenChange={() => setPreviewDataset(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-md z-50 shadow-2xl">
              <Dialog.Title className="text-lg font-semibold text-foreground">Schema Preview</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">{previewDataset?.name}</Dialog.Description>
              <div className="mt-5 space-y-2">
                {previewDataset && Object.entries(previewDataset.schema).map(([key, type]) => (
                  <div key={key} className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-2 border border-border/30">
                    <span className="text-sm font-mono text-foreground">{key}</span>
                    <Badge variant="outline">{String(type)}</Badge>
                  </div>
                ))}
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
              <Dialog.Title className="text-lg font-semibold text-foreground">Delete Dataset</Dialog.Title>
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
