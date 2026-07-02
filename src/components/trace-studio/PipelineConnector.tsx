"use client"
import { motion } from "framer-motion"

interface PipelineConnectorProps {
  status: "success" | "error" | "warning"
}

const statusColors = {
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
}

export function PipelineConnector({ status }: PipelineConnectorProps) {
  const color = statusColors[status]

  return (
    <div className="flex justify-center py-1" style={{ marginLeft: "2.25rem" }}>
      <div className="relative flex flex-col items-center h-8">
        {/* Dashed line */}
        <div
          className="w-px h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, ${color}40 0px, ${color}40 4px, transparent 4px, transparent 8px)`,
          }}
        />
        {/* Animated dot */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  )
}
