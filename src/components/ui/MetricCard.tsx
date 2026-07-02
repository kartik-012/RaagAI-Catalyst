"use client"
import { motion } from "framer-motion"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "./Card"

interface MetricCardProps {
  title: string
  value: string
  change?: string
  changePositive?: boolean
  icon: LucideIcon
  iconColor?: string
  description?: string
  index?: number
}

export function MetricCard({
  title, value, change, changePositive, icon: Icon,
  iconColor = "text-primary", description, index = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
    >
      <Card className="p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">
              {value}
            </p>
            {(change || description) && (
              <p className={cn(
                "text-xs mt-1",
                change
                  ? changePositive ? "text-emerald-500" : "text-red-500"
                  : "text-muted-foreground"
              )}>
                {change ?? description}
              </p>
            )}
          </div>
          <div className={cn(
            "w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0",
          )}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
