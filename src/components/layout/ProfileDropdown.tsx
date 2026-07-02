"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { User, Settings, Key, LogOut, Sun, Moon, Monitor, ChevronDown, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store"

export function ProfileDropdown() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { userProfile } = useAppStore()

  const handleLogout = () => {
    localStorage.removeItem("ragaai_token")
    localStorage.removeItem("ragaai-auth")
    toast.success("Signed out successfully")
    router.push("/")
  }

  const menuItems = [
    { label: "Profile", icon: User, onClick: () => router.push("/dashboard/settings") },
    { label: "Settings", icon: Settings, onClick: () => router.push("/dashboard/settings") },
    { label: "API Keys", icon: Key, onClick: () => router.push("/dashboard/api-keys") },
  ]

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition-colors focus:outline-none">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center text-xs font-semibold text-primary border border-primary/20">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-56 rounded-xl border border-border bg-popover p-1.5 shadow-2xl animate-fade-in"
        >
          {/* User info */}
          <div className="px-3 py-2.5 border-b border-border mb-1">
            <p className="text-sm font-semibold text-foreground">{userProfile.name}</p>
            <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
            <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
              {userProfile.role}
            </span>
          </div>

          {/* Menu items */}
          {menuItems.map((item) => (
            <DropdownMenu.Item
              key={item.label}
              onClick={item.onClick}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
            >
              <item.icon className="w-4 h-4 text-muted-foreground" />
              {item.label}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          {/* Theme submenu */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer hover:bg-muted focus:bg-muted focus:outline-none transition-colors">
              <Sun className="w-4 h-4 text-muted-foreground" />
              Theme
              <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto -rotate-90" />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                sideOffset={8}
                className="z-50 w-40 rounded-xl border border-border bg-popover p-1.5 shadow-2xl animate-fade-in"
              >
                {themes.map((t) => (
                  <DropdownMenu.Item
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
                  >
                    <t.icon className="w-4 h-4 text-muted-foreground" />
                    {t.label}
                    {theme === t.value && <Check className="w-3.5 h-3.5 text-primary ml-auto" />}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          {/* Sign out */}
          <DropdownMenu.Item
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 focus:outline-none transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
