"use client"
import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, GitBranch, FlaskConical, Database, MessageSquare,
  Shield, Swords, Sparkles, Settings, Key, FolderKanban, Activity,
  Search, Plus, ArrowRight,
} from "lucide-react"
import { useAppStore } from "@/store"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Traces", href: "/dashboard/traces", icon: GitBranch },
  { label: "Evaluations", href: "/dashboard/evaluations", icon: FlaskConical },
  { label: "Experiments", href: "/dashboard/experiments", icon: Activity },
  { label: "Datasets", href: "/dashboard/datasets", icon: Database },
  { label: "Prompts", href: "/dashboard/prompts", icon: MessageSquare },
  { label: "Synthetic Data", href: "/dashboard/synthetic", icon: Sparkles },
  { label: "Guardrails", href: "/dashboard/guardrails", icon: Shield },
  { label: "Red Teaming", href: "/dashboard/redteaming", icon: Swords },
  { label: "API Keys", href: "/dashboard/api-keys", icon: Key },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

const quickActions = [
  { label: "New Project", href: "/dashboard/projects", icon: Plus },
  { label: "View Traces", href: "/dashboard/traces", icon: ArrowRight },
  { label: "New Evaluation", href: "/dashboard/evaluations", icon: Plus },
  { label: "New Dataset", href: "/dashboard/datasets", icon: Plus },
]

export function CommandPalette() {
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore()

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      setCommandPaletteOpen(!commandPaletteOpen)
    }
  }, [commandPaletteOpen, setCommandPaletteOpen])

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onKeyDown])

  const navigate = (href: string) => {
    router.push(href)
    setCommandPaletteOpen(false)
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <Command
              className="rounded-xl border border-border bg-popover shadow-2xl overflow-hidden"
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Escape") setCommandPaletteOpen(false) }}
            >
              <div className="flex items-center gap-2 px-4 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <Command.Input
                  placeholder="Search pages, actions..."
                  className="w-full h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                />
                <kbd className="text-[10px] font-mono bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground shrink-0">ESC</kbd>
              </div>

              <Command.List className="max-h-72 overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide px-2 py-1.5">
                  {navItems.map((item) => (
                    <Command.Item
                      key={item.href}
                      value={item.label}
                      onSelect={() => navigate(item.href)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-muted transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Separator className="h-px bg-border my-1" />

                <Command.Group heading="Quick Actions" className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide px-2 py-1.5">
                  {quickActions.map((item) => (
                    <Command.Item
                      key={item.label}
                      value={item.label}
                      onSelect={() => navigate(item.href)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-muted transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-primary" />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
                <span><kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded mr-1">↑↓</kbd> Navigate</span>
                <span><kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded mr-1">↵</kbd> Select</span>
                <span><kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded mr-1">ESC</kbd> Close</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
