"use client"
import { Sidebar } from "@/components/layout/Sidebar"
import { CommandPalette } from "@/components/layout/CommandPalette"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </div>
      <CommandPalette />
    </div>
  )
}
