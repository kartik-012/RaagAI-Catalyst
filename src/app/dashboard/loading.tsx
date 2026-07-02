import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-background/50 backdrop-blur-sm">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground mt-4 animate-pulse">Loading module...</p>
    </div>
  )
}
