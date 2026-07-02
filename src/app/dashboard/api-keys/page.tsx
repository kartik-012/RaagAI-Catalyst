"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Key, Copy, Check, Trash2, Eye, EyeOff, ShieldAlert } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { toast } from "sonner"

const initialKeys = [
  { id: "key-1", name: "Production API Key", key: "sk-rg-prod-8f92j3n4m...", fullKey: "sk-rg-prod-8f92j3n4m5b6v7c8x9z0", createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), lastUsed: new Date(Date.now() - 3600000).toISOString(), role: "Admin" },
  { id: "key-2", name: "Development CI/CD", key: "sk-rg-dev-2m4n5b6v...", fullKey: "sk-rg-dev-2m4n5b6v7c8x9z0l1k2j", createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), lastUsed: new Date(Date.now() - 86400000).toISOString(), role: "Write" },
]

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(initialKeys)
  const [createOpen, setCreateOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyRole, setNewKeyRole] = useState("Write")
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleKey, setVisibleKey] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ragaai_api_keys")
    if (saved) {
      try { setKeys(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const saveKeys = (newKeys: typeof initialKeys) => {
    setKeys(newKeys)
    localStorage.setItem("ragaai_api_keys", JSON.stringify(newKeys))
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success("API key copied")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreate = () => {
    if (!newKeyName.trim()) { toast.error("Key name required"); return }
    
    // Generate mock key
    const prefix = newKeyRole === "Admin" ? "prod" : "dev"
    const randomChars = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const newFullKey = `sk-rg-${prefix}-${randomChars}`
    
    const newApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `${newFullKey.substring(0, 18)}...`,
      fullKey: newFullKey,
      createdAt: new Date().toISOString(),
      lastUsed: "Never",
      role: newKeyRole
    }
    
    saveKeys([newApiKey, ...keys])
    setGeneratedKey(newFullKey)
    toast.success("API key generated successfully")
  }

  const handleDelete = (id: string) => {
    saveKeys(keys.filter(k => k.id !== id))
    toast.success("API key revoked")
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="API Keys" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-between items-center bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 text-sm text-foreground">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <p>Keep your API keys secure. Do not share them in publicly accessible areas like GitHub or client-side code.</p>
          </div>
          <Button icon={<Plus className="w-3.5 h-3.5" />} onClick={() => { setCreateOpen(true); setGeneratedKey(null); setNewKeyName(""); }}>
            Generate New Key
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-xs uppercase text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">API Key</th>
                  <th className="px-6 py-4">Permissions</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Last Used</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {keys.map((k, i) => (
                  <motion.tr key={k.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-muted/10">
                    <td className="px-6 py-4 font-medium text-foreground">{k.name}</td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span>{visibleKey === k.id ? k.fullKey : k.key}</span>
                        <button onClick={() => setVisibleKey(visibleKey === k.id ? null : k.id)} className="text-muted-foreground hover:text-foreground">
                          {visibleKey === k.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge variant={k.role === "Admin" ? "success" : "outline"}>{k.role}</Badge></td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{new Date(k.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{k.lastUsed === "Never" ? "Never" : new Date(k.lastUsed).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(k.id, k.fullKey)}>
                          {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(k.id)} className="hover:bg-red-500/10 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {keys.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground text-sm">No API keys found. Generate one to get started.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Create Modal */}
        <Dialog.Root open={createOpen} onOpenChange={setCreateOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-full max-w-md z-50 shadow-2xl">
              {!generatedKey ? (
                <>
                  <Dialog.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" /> Create API Key
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-muted-foreground mt-1">Generate a new API key for programmatic access.</Dialog.Description>
                  
                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Key Name</label>
                      <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="e.g. CI/CD Pipeline"
                        className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Permissions</label>
                      <select value={newKeyRole} onChange={e => setNewKeyRole(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="Read">Read Only</option>
                        <option value="Write">Write (Upload Traces)</option>
                        <option value="Admin">Admin (Full Access)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-border">
                    <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate}>Generate Key</Button>
                  </div>
                </>
              ) : (
                <>
                  <Dialog.Title className="text-lg font-semibold text-emerald-500 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Key Generated Successfully
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-muted-foreground mt-2">
                    Please copy this key and store it securely. For security reasons, <strong>you will not be able to see it again</strong>.
                  </Dialog.Description>
                  
                  <div className="mt-6 bg-muted/50 p-4 rounded-lg border border-border flex items-center justify-between">
                    <code className="text-sm font-mono text-foreground break-all">{generatedKey}</code>
                    <Button variant="outline" size="sm" onClick={() => handleCopy("new", generatedKey)} className="ml-4 shrink-0">
                      {copiedId === "new" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setCreateOpen(false)}>I have saved it safely</Button>
                  </div>
                </>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </main>
    </div>
  )

  function CheckCircle2(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
  }
}
