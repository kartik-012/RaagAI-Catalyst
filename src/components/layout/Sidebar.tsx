"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, GitBranch, FlaskConical, Database, MessageSquare,
  Shield, Swords, Sparkles, Settings, Key, ChevronLeft, ChevronRight,
  Zap, FolderKanban, Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { type: "divider", label: "Observability" },
  { label: "Traces", href: "/dashboard/traces", icon: GitBranch },
  { label: "Evaluations", href: "/dashboard/evaluations", icon: FlaskConical },
  { label: "Experiments", href: "/dashboard/experiments", icon: Activity },
  { type: "divider", label: "Data" },
  { label: "Datasets", href: "/dashboard/datasets", icon: Database },
  { label: "Prompts", href: "/dashboard/prompts", icon: MessageSquare },
  { label: "Synthetic Data", href: "/dashboard/synthetic", icon: Sparkles },
  { type: "divider", label: "Security" },
  { label: "Guardrails", href: "/dashboard/guardrails", icon: Shield },
  { label: "Red Teaming", href: "/dashboard/redteaming", icon: Swords },
  { type: "divider", label: "Settings" },
  { label: "API Keys", href: "/dashboard/api-keys", icon: Key },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border z-20 shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border overflow-hidden">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="font-semibold text-sm text-sidebar-foreground whitespace-nowrap"
              >
                RagaAI Catalyst
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {navItems.map((item, i) => {
          if ("type" in item) {
            return (
              <div key={i} className={cn("px-2 mt-4 mb-1", sidebarCollapsed && "hidden")}>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                  {item.label}
                </span>
              </div>
            )
          }
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-2.5 px-2 py-2 rounded-md text-sm font-medium transition-colors mb-0.5",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active && "text-primary")} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-14 mt-2 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center hover:bg-sidebar-accent transition-colors z-10"
      >
        {sidebarCollapsed
          ? <ChevronRight className="w-3 h-3 text-sidebar-foreground/60" />
          : <ChevronLeft className="w-3 h-3 text-sidebar-foreground/60" />}
      </button>
    </motion.aside>
  )
}
