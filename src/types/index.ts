// Core entity types mirroring RagaAI Catalyst backend

export interface Project {
  id: string
  name: string
  usecase: string
  description?: string
  createdAt: string
  updatedAt: string
  tracesCount: number
  datasetsCount: number
  status: "active" | "archived"
}

export interface Dataset {
  id: string
  name: string
  projectId: string
  projectName: string
  rowCount: number
  columnCount: number
  createdAt: string
  schema: SchemaMapping
  status: "ready" | "processing" | "failed"
}

export interface SchemaMapping {
  [key: string]: string
}

export type MetricName =
  | "Faithfulness"
  | "Hallucination"
  | "Relevance"
  | "Coherence"
  | "Toxicity"
  | "PII"
  | "Groundedness"
  | "AnswerRelevance"
  | "ContextPrecision"
  | "ContextRecall"

export interface Metric {
  name: MetricName
  config: {
    model: string
    provider: string
    threshold?: {
      gte?: number
      lte?: number
      eq?: number
    }
  }
  column_name: string
  schema_mapping: SchemaMapping
}

export interface Evaluation {
  id: string
  projectName: string
  datasetName: string
  metrics: Metric[]
  status: "pending" | "running" | "completed" | "failed"
  createdAt: string
  completedAt?: string
  results?: EvaluationResult[]
}

export interface EvaluationResult {
  metricName: string
  columnName: string
  score: number
  threshold?: number
  passed: boolean
  rowResults?: { rowId: string; score: number }[]
}

export interface Trace {
  id: string
  projectName: string
  datasetName: string
  tracerType: "langchain" | "llamaindex" | "openai" | "custom" | "agentic"
  startTime: string
  endTime?: string
  duration?: number
  status: "active" | "completed" | "failed"
  spans: Span[]
  tokenUsage?: TokenUsage
  cost?: number
  model?: string
}

export interface Span {
  id: string
  name: string
  type: "llm" | "tool" | "agent" | "retrieval" | "embedding" | "custom"
  startTime: string
  endTime?: string
  duration?: number
  input?: string
  output?: string
  metadata?: Record<string, unknown>
  children?: Span[]
  tokenUsage?: TokenUsage
  cost?: number
  model?: string
  error?: string
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface Prompt {
  id: string
  name: string
  projectName: string
  version: number
  content: string
  variables: string[]
  model?: string
  provider?: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface Guardrail {
  id: string
  name: string
  type: "input" | "output"
  detector: string
  threshold: number
  action: "block" | "warn" | "log"
  enabled: boolean
}

export interface RedTeamTest {
  id: string
  projectName: string
  scenarioCount: number
  status: "pending" | "running" | "completed" | "failed"
  attackTypes: string[]
  createdAt: string
  results?: {
    total: number
    passed: number
    failed: number
    vulnerabilities: string[]
  }
}

export interface SyntheticDataJob {
  id: string
  projectName: string
  datasetName: string
  generationConfig: {
    numSamples: number
    model: string
    provider: string
    template?: string
  }
  status: "pending" | "running" | "completed" | "failed"
  createdAt: string
  outputDatasetName?: string
}

export interface ApiKey {
  id: string
  service: string
  key: string
  createdAt: string
  lastUsed?: string
}

export interface DashboardMetrics {
  totalProjects: number
  totalTraces: number
  totalEvaluations: number
  totalDatasets: number
  avgLatency: number
  avgCost: number
  avgHallucinationScore: number
  avgFaithfulnessScore: number
  recentActivity: ActivityItem[]
  latencyTrend: TrendPoint[]
  costTrend: TrendPoint[]
  scoresTrend: ScoresTrendPoint[]
}

export interface ActivityItem {
  id: string
  type: "trace" | "evaluation" | "dataset" | "project"
  message: string
  timestamp: string
  status?: "success" | "warning" | "error"
}

export interface TrendPoint {
  date: string
  value: number
}

export interface ScoresTrendPoint {
  date: string
  faithfulness: number
  hallucination: number
  relevance: number
}
