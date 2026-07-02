"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Swords, Play, X, Skull, ShieldAlert, Crosshair } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge, StatusBadge } from "@/components/ui/Badge"
import { toast } from "sonner"

const initialCampaigns = [
  { id: "rt-1", name: "Security Bypass Tests", targetApp: "Medical-RAG", attacks: 250, vulnerabilitiesFound: 12, status: "completed" },
  { id: "rt-2", name: "Toxicity & Hate Speech", targetApp: "CustomerSupport", attacks: 1000, vulnerabilitiesFound: 3, status: "running", progress: 68 },
]

const radarData = [
  { subject: 'Prompt Injection', score: 85 },
  { subject: 'Jailbreak', score: 65 },
  { subject: 'Toxicity', score: 40 },
  { subject: 'PII Leak', score: 90 },
  { subject: 'Bias', score: 30 },
  { subject: 'Hallucination', score: 75 },
]

export default function RedTeamingPage() {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", targetApp: "Medical-RAG", attackType: "Jailbreak" })

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ragaai_redteaming")
    if (saved) {
      try { setCampaigns(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const saveCampaigns = (newCampaigns: typeof initialCampaigns) => {
    setCampaigns(newCampaigns)
    localStorage.setItem("ragaai_redteaming", JSON.stringify(newCampaigns))
  }

  const filtered = campaigns.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = () => {
    if (!formData.name.trim()) { toast.error("Campaign name required"); return }
    const newCamp = {
      id: `rt-${Date.now()}`,
      name: formData.name,
      targetApp: formData.targetApp,
      attacks: 0,
      vulnerabilitiesFound: 0,
      status: "running" as const,
      progress: 0
    }
    const updated = [newCamp, ...campaigns]
    saveCampaigns(updated)
    setCreateOpen(false)
    setFormData({ name: "", targetApp: "Medical-RAG", attackType: "Jailbreak" })
    toast.success("Red Teaming campaign started")

    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setCampaigns(prev => {
        const nextState = prev.map(c => c.id === newCamp.id ? { 
          ...c, 
          progress: Math.min(progress, 100),
          attacks: Math.floor((progress / 100) * 500),
          vulnerabilitiesFound: Math.floor(Math.random() * 5),
          status: progress >= 100 ? "completed" : "running" 
        } : c)
        // Only save to localStorage when completed to avoid spamming I/O
        if (progress >= 100) localStorage.setItem("ragaai_redteaming", JSON.stringify(nextState))
        return nextState
      })
      if (progress >= 100) clearInterval(interval)
    }, 500)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Red Teaming" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..."
              className="w-full pl-8 pr-4 h-9 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)} className="bg-red-500 hover:bg-red-600 text-white border-transparent shadow-lg shadow-red-500/20">New Campaign</Button>
        </div>

        {/* Animated Vulnerability Spider Graph */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Card className="p-6 relative overflow-hidden border-red-500/10 flex flex-col md:flex-row gap-6 items-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
            
            <div className="flex-1 w-full">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-500"/> Vulnerability Surface Area</h3>
              <p className="text-sm text-muted-foreground mb-4">Radar analysis of system weaknesses across all active campaigns.</p>
              
              <div className="space-y-4">
                {radarData.map(item => (
                  <div key={item.subject}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{item.subject}</span>
                      <span className="font-mono text-red-500">{item.score}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${item.score}%` }} 
                        transition={{ duration: 1, type: "spring" }}
                        className="h-full bg-red-500" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(128,128,128,0.3)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888888', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Vulnerabilities" dataKey="score" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((camp, i) => (
            <motion.div key={camp.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                      <Swords className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{camp.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Target: {camp.targetApp}</p>
                    </div>
                  </div>
                  <StatusBadge status={camp.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-muted/30 border border-border/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Crosshair className="w-3.5 h-3.5" /> Attacks Sent</div>
                    <span className="text-lg font-mono font-bold text-foreground">{camp.attacks.toLocaleString()}</span>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-red-400 mb-1"><Skull className="w-3.5 h-3.5" /> Vulnerabilities</div>
                    <span className="text-lg font-mono font-bold text-red-500">{camp.vulnerabilitiesFound}</span>
                  </div>
                </div>

                {camp.status === "running" ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1 animate-pulse text-red-400"><ShieldAlert className="w-3 h-3"/> Attacking...</span>
                      <span>{camp.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div className="h-full bg-red-500" initial={{ width: 0 }} animate={{ width: `${camp.progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="w-full text-xs">View Report</Button>
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
              <Dialog.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-500" /> New Attack Campaign
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-1">Automatically probe an application for vulnerabilities.</Dialog.Description>
              
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Campaign Name</label>
                  <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Prompt Injection Suite"
                    className="w-full px-3 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" autoFocus />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Target Application</label>
                  <select value={formData.targetApp} onChange={e => setFormData(p => ({ ...p, targetApp: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50">
                    {["Medical-RAG", "CustomerSupport", "LegalDoc-AI", "CodeAssist"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Attack Type</label>
                  <select value={formData.attackType} onChange={e => setFormData(p => ({ ...p, attackType: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50">
                    {["Jailbreak", "Prompt Injection", "Toxicity", "PII Extraction", "Hallucination Induction"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-border">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} className="bg-red-500 hover:bg-red-600 text-white" icon={<Play className="w-4 h-4"/>}>Launch Attack</Button>
              </div>
              <Dialog.Close asChild><button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button></Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </main>
    </div>
  )
}
