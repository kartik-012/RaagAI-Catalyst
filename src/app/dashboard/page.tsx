"use client"
import { motion } from "framer-motion"
import {
  Activity, GitBranch, Database, FlaskConical,
  TrendingUp, AlertTriangle, CheckCircle2, Clock,
} from "lucide-react"
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Topbar } from "@/components/layout/Topbar"
import { MetricCard } from "@/components/ui/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge, StatusBadge } from "@/components/ui/Badge"
import { mockDashboardMetrics } from "@/services/api"
import { formatLatency, formatCost, formatRelativeTime, formatNumber } from "@/lib/utils"

const m = mockDashboardMetrics

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Overview" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Projects" value={String(m.totalProjects)}
            change="+2 this month" changePositive icon={Activity}
            iconColor="text-primary" index={0} />
          <MetricCard title="Total Traces" value={formatNumber(m.totalTraces)}
            change="+18% vs last week" changePositive icon={GitBranch}
            iconColor="text-blue-500" index={1} />
          <MetricCard title="Evaluations" value={String(m.totalEvaluations)}
            description="Across all projects" icon={FlaskConical}
            iconColor="text-violet-500" index={2} />
          <MetricCard title="Datasets" value={String(m.totalDatasets)}
            description="Ready for evaluation" icon={Database}
            iconColor="text-emerald-500" index={3} />
        </div>

        {/* Performance Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Avg Latency" value={formatLatency(m.avgLatency)}
            change="-12% vs last week" changePositive icon={Clock}
            iconColor="text-amber-500" index={4} />
          <MetricCard title="Avg Cost / call" value={formatCost(m.avgCost)}
            change="+5% vs last week" changePositive={false} icon={TrendingUp}
            iconColor="text-orange-500" index={5} />
          <MetricCard title="Faithfulness" value={`${(m.avgFaithfulnessScore * 100).toFixed(0)}%`}
            change="+3% vs last week" changePositive icon={CheckCircle2}
            iconColor="text-emerald-500" index={6} />
          <MetricCard title="Hallucination" value={`${(m.avgHallucinationScore * 100).toFixed(0)}%`}
            change="-2% vs last week" changePositive icon={AlertTriangle}
            iconColor="text-red-500" index={7} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Scores Trend */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Quality Scores — 14 day trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={m.scoresTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number, name: string) => [`${(v * 100).toFixed(1)}%`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="faithfulness" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Faithfulness" />
                    <Line type="monotone" dataKey="relevance" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Relevance" />
                    <Line type="monotone" dataKey="hallucination" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} name="Hallucination" strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Latency + Cost */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle>Latency — 14 day trend (ms)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={m.latencyTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(v) => `${v}ms`} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number) => [`${v.toFixed(0)}ms`, "Latency"]}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" fill="url(#latencyGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {m.recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      item.status === "success" ? "bg-emerald-500" :
                      item.status === "warning" ? "bg-amber-500" : "bg-red-500"
                    }`} />
                    <span className="text-sm text-foreground flex-1 min-w-0 truncate">{item.message}</span>
                    <Badge variant={
                      item.type === "trace" ? "info" :
                      item.type === "evaluation" ? "default" :
                      item.type === "dataset" ? "success" : "outline"
                    }>{item.type}</Badge>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
