// API service — mirrors RagaAI Catalyst backend endpoints exactly
import type {
  Project, Dataset, Evaluation, Metric, Trace,
  Prompt, Guardrail, RedTeamTest, ApiKey, DashboardMetrics
} from "@/types"

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_RAGAAI_BASE_URL ?? "https://catalyst.raga.ai/api"

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${
    typeof window !== "undefined"
      ? localStorage.getItem("ragaai_token") ?? ""
      : ""
  }`,
})

async function fetchAPI<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${getBaseUrl()}${path}`
  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...(options?.headers ?? {}) },
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || `HTTP ${res.status}`)
  }
  const json = await res.json()
  return json.data ?? json
}

// ─── AUTH ───────────────────────────────────────────────────────────────────
export const authAPI = {
  getToken: (accessKey: string, secretKey: string) =>
    fetchAPI<{ token: string }>("/v1/llm/get-token", {
      method: "POST",
      body: JSON.stringify({ accessKey, secretKey }),
    }),
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export const projectsAPI = {
  list: () =>
    fetchAPI<{ content: Project[] }>("/v2/llm/projects?size=99999").then(
      (d) => d.content
    ),
  create: (name: string, usecase: string) =>
    fetchAPI<Project>("/v2/llm/projects", {
      method: "POST",
      body: JSON.stringify({ name, type: usecase }),
    }),
  usecases: () => fetchAPI<string[]>("/v1/llm/usecases"),
}

// ─── DATASETS ────────────────────────────────────────────────────────────────
export const datasetsAPI = {
  list: (projectId: string) =>
    fetchAPI<{ content: Dataset[] }>("/v2/llm/dataset", {
      method: "POST",
      headers: { "X-Project-Id": projectId },
      body: JSON.stringify({ size: 99999, page: "0", projectId, search: "" }),
    }).then((d) => d.content),

  getSchema: (projectId: string) =>
    fetchAPI<{ schema: Record<string, string> }>(
      `/v2/llm/dataset/schema?projectId=${projectId}`,
      { headers: { "X-Project-Id": projectId } }
    ),
}

// ─── EVALUATIONS ─────────────────────────────────────────────────────────────
export const evaluationsAPI = {
  list: (projectId: string, datasetId: string) =>
    fetchAPI<Evaluation[]>(`/v2/llm/evaluation?projectId=${projectId}&datasetId=${datasetId}`),

  listMetrics: (projectId: string) =>
    fetchAPI<{ metrics: string[] }>(`/v2/llm/metrics?projectId=${projectId}`, {
      headers: { "X-Project-Id": projectId },
    }),

  addMetrics: (projectId: string, datasetId: string, metrics: Metric[]) =>
    fetchAPI<{ jobId: string }>("/v2/llm/evaluation/add-metrics", {
      method: "POST",
      headers: { "X-Project-Id": projectId },
      body: JSON.stringify({ projectId, datasetId, metrics }),
    }),

  getStatus: (jobId: string, projectId: string) =>
    fetchAPI<{ status: string; progress: number }>(
      `/v2/llm/evaluation/status?jobId=${jobId}`,
      { headers: { "X-Project-Id": projectId } }
    ),

  getResults: (projectId: string, datasetId: string) =>
    fetchAPI<{ results: unknown[] }>(
      `/v2/llm/evaluation/results?projectId=${projectId}&datasetId=${datasetId}`,
      { headers: { "X-Project-Id": projectId } }
    ),
}

// ─── TRACES ──────────────────────────────────────────────────────────────────
export const tracesAPI = {
  list: (projectId: string, datasetId?: string) =>
    fetchAPI<Trace[]>(
      `/v2/llm/traces?projectId=${projectId}${datasetId ? `&datasetId=${datasetId}` : ""}`,
      { headers: { "X-Project-Id": projectId } }
    ),

  get: (traceId: string, projectId: string) =>
    fetchAPI<Trace>(`/v2/llm/traces/${traceId}`, {
      headers: { "X-Project-Id": projectId },
    }),
}

// ─── PROMPTS ─────────────────────────────────────────────────────────────────
export const promptsAPI = {
  list: (projectId: string) =>
    fetchAPI<Prompt[]>("/playground/prompt/list", {
      headers: { "X-Project-Id": projectId },
    }),

  get: (promptName: string, version: number, projectId: string) =>
    fetchAPI<Prompt>(
      `/playground/prompt/${promptName}?version=${version}`,
      { headers: { "X-Project-Id": projectId } }
    ),
}

// ─── API KEYS ────────────────────────────────────────────────────────────────
export const apiKeysAPI = {
  upload: (keys: Record<string, string>) =>
    fetchAPI<void>("/v1/llm/secrets/upload", {
      method: "POST",
      body: JSON.stringify({
        secrets: Object.entries(keys).map(([type, value]) => ({
          type, key: type, value,
        })),
      }),
    }),

  list: () =>
    fetchAPI<ApiKey[]>("/v1/llm/secrets"),
}

// ─── GUARDRAILS ──────────────────────────────────────────────────────────────
export const guardrailsAPI = {
  list: (projectId: string) =>
    fetchAPI<Guardrail[]>(`/v1/llm/guardrails?projectId=${projectId}`),

  create: (projectId: string, guardrail: Partial<Guardrail>) =>
    fetchAPI<Guardrail>("/v1/llm/guardrails", {
      method: "POST",
      headers: { "X-Project-Id": projectId },
      body: JSON.stringify(guardrail),
    }),
}

// ─── RED TEAMING ─────────────────────────────────────────────────────────────
export const redTeamAPI = {
  run: (projectId: string, config: unknown) =>
    fetchAPI<RedTeamTest>("/v1/llm/redteam/run", {
      method: "POST",
      headers: { "X-Project-Id": projectId },
      body: JSON.stringify(config),
    }),

  getStatus: (jobId: string, projectId: string) =>
    fetchAPI<{ status: string; results: unknown }>(
      `/v1/llm/redteam/status?jobId=${jobId}`,
      { headers: { "X-Project-Id": projectId } }
    ),
}

// ─── MOCK DATA (dev/demo) ────────────────────────────────────────────────────
export const mockDashboardMetrics: DashboardMetrics = {
  totalProjects: 12,
  totalTraces: 4821,
  totalEvaluations: 238,
  totalDatasets: 47,
  avgLatency: 842,
  avgCost: 0.0034,
  avgHallucinationScore: 0.12,
  avgFaithfulnessScore: 0.89,
  recentActivity: [
    { id: "1", type: "evaluation", message: "Evaluation completed on MedicalQA dataset", timestamp: new Date(Date.now() - 60000).toISOString(), status: "success" },
    { id: "2", type: "trace", message: "1,204 traces uploaded from LangChain app", timestamp: new Date(Date.now() - 180000).toISOString(), status: "success" },
    { id: "3", type: "dataset", message: "CustomerSupport-v2 dataset created", timestamp: new Date(Date.now() - 600000).toISOString(), status: "success" },
    { id: "4", type: "evaluation", message: "Hallucination threshold breach detected", timestamp: new Date(Date.now() - 1200000).toISOString(), status: "warning" },
    { id: "5", type: "project", message: "LegalDocumentRAG project created", timestamp: new Date(Date.now() - 3600000).toISOString(), status: "success" },
  ],
  latencyTrend: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
    value: 700 + Math.random() * 400,
  })),
  costTrend: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
    value: +(0.002 + Math.random() * 0.005).toFixed(4),
  })),
  scoresTrend: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
    faithfulness: +(0.75 + Math.random() * 0.2).toFixed(2),
    hallucination: +(0.05 + Math.random() * 0.15).toFixed(2),
    relevance: +(0.70 + Math.random() * 0.25).toFixed(2),
  })),
}
