"use client"
import { Search, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useAppStore } from "@/store"
import { cn } from "@/lib/utils"
import { NotificationsPanel } from "./NotificationsPanel"
import { ProfileDropdown } from "./ProfileDropdown"

export function Topbar({ title }: { title?: string }) {
  const { theme, setTheme } = useTheme()
  const { setCommandPaletteOpen } = useAppStore()

  const themeIcons = { light: Sun, dark: Moon, system: Monitor }
  const ThemeIcon = themeIcons[(theme as keyof typeof themeIcons) ?? "dark"] ?? Moon
  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark"

  return (
    <header className="h-14 border-b border-border flex items-center px-6 gap-4 bg-background/95 backdrop-blur-sm sticky top-0 z-30">
      {title && (
        <h1 className="text-sm font-semibold text-foreground mr-auto">{title}</h1>
      )}

      {/* Search trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm",
          "bg-muted/50 border border-border text-muted-foreground",
          "hover:bg-muted transition-colors",
          title ? "ml-auto" : "flex-1 max-w-xs"
        )}
      >
        <Search className="w-3.5 h-3.5" />
        <span className="text-xs">Search...</span>
        <kbd className="ml-auto text-[10px] font-mono bg-background border border-border px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(nextTheme)}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        title={`Current: ${theme}. Click to switch.`}
      >
        <ThemeIcon className="w-4 h-4" />
      </button>

      {/* Notifications */}
      <NotificationsPanel />

      {/* Profile */}
      <ProfileDropdown />
    </header>
  )
}
