"use client"
import { useState } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Bell, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/utils"

interface Notification {
  id: string
  message: string
  timestamp: string
  status: "success" | "warning" | "error"
  read: boolean
}

const initialNotifications: Notification[] = [
  { id: "n1", message: "Evaluation completed on MedicalQA dataset", timestamp: new Date(Date.now() - 120000).toISOString(), status: "success", read: false },
  { id: "n2", message: "Hallucination threshold breach detected", timestamp: new Date(Date.now() - 900000).toISOString(), status: "warning", read: false },
  { id: "n3", message: "1,204 traces uploaded from LangChain app", timestamp: new Date(Date.now() - 3600000).toISOString(), status: "success", read: false },
  { id: "n4", message: "Guardrail blocked toxic output in CustomerSupport", timestamp: new Date(Date.now() - 7200000).toISOString(), status: "error", read: true },
  { id: "n5", message: "New dataset CustomerSupport-v2 created", timestamp: new Date(Date.now() - 10800000).toISOString(), status: "success", read: true },
]

const statusDotColors = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground focus:outline-none">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-[9px] font-bold text-primary-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 rounded-xl border border-border bg-popover shadow-2xl animate-fade-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-72 overflow-y-auto">
            {notifications.map((notif) => (
              <DropdownMenu.Item
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50 focus:outline-none transition-colors border-b border-border/50 last:border-0",
                  !notif.read && "bg-primary/3"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full shrink-0 mt-1.5", statusDotColors[notif.status])} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs leading-relaxed", notif.read ? "text-muted-foreground" : "text-foreground font-medium")}>
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatRelativeTime(notif.timestamp)}</p>
                </div>
                {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
              </DropdownMenu.Item>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5">
            <p className="text-xs text-center text-muted-foreground">All caught up!</p>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
