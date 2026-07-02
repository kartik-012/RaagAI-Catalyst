# RagaAI Catalyst — Enterprise Dashboard

A professional Next.js 14 frontend for the RagaAI Catalyst LLM observability platform.

---

## What is this?

This dashboard gives you a beautiful web UI to manage everything in RagaAI Catalyst:

- **Projects** — create and manage your LLM projects
- **Traces** — view every LLM call recorded by LangChain, LlamaIndex, OpenAI, etc.
- **Evaluations** — run Faithfulness, Hallucination, Relevance and 20+ metrics
- **Datasets** — upload CSVs, manage schema mappings
- **Prompts** — version and manage prompt templates
- **Guardrails** — PII, toxicity, hallucination filters
- **Red Teaming** — automated adversarial testing
- **Synthetic Data** — generate training data with GPT-4o or Claude
- **API Keys** — store provider keys securely
- **Settings** — configure base URL, credentials, theme

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Charts and graphs |
| Zustand | Global state |
| React Query | API data fetching |
| Lucide Icons | Icon set |
| Sonner | Toast notifications |

---

## Setup — Step by Step

### Step 1 — Make sure you have Node.js installed

```bash
node --version
# Should be 18.0 or higher
```

If not installed → download from https://nodejs.org

---

### Step 2 — Install dependencies

Open terminal in this folder and run:

```bash
npm install
```

This downloads all the packages listed in `package.json`. Takes 1-2 minutes.

---

### Step 3 — Create environment file

Create a file called `.env.local` in the root folder:

```
NEXT_PUBLIC_RAGAAI_BASE_URL=https://catalyst.raga.ai/api
```

If you have a self-hosted instance, replace the URL with your own.

---

### Step 4 — Start the development server

```bash
npm run dev
```

Open your browser at → **http://localhost:3000**

---

### Step 5 — Login

On the login page, enter your:
- **Access Key** — from your RagaAI profile → Authenticate → Generate New Key
- **Secret Key** — same place

---

## Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
  app/                    ← Pages (Next.js App Router)
    page.tsx              ← Login page
    dashboard/
      page.tsx            ← Overview dashboard
      traces/page.tsx     ← Traces table
      evaluations/        ← Evaluation runs
      datasets/           ← Dataset management
      prompts/            ← Prompt manager
      guardrails/         ← Guardrail configuration
      redteaming/         ← Red team tests
      synthetic/          ← Synthetic data jobs
      api-keys/           ← API key vault
      settings/           ← App settings
  components/
    layout/               ← Sidebar, Topbar
    ui/                   ← Button, Card, Badge, MetricCard
  services/
    api.ts                ← All backend API calls
  store/
    index.ts              ← Zustand global state
  types/
    index.ts              ← TypeScript types
  lib/
    utils.ts              ← Helper functions
```

---

## Connecting to Real Backend

All API calls are in `src/services/api.ts`.
Each function matches the exact RagaAI Catalyst endpoint from the Python SDK.

To use real data:
1. Set `NEXT_PUBLIC_RAGAAI_BASE_URL` in `.env.local`
2. Login with real access/secret keys
3. The token is stored in `localStorage` and sent as `Bearer` header

---

## Customization

- **Colors** → `src/app/globals.css` (CSS variables)
- **Dark/Light theme** → Toggle in top-right corner
- **Sidebar** → Collapse with the arrow button
- **Add a new page** → Create `src/app/dashboard/newpage/page.tsx`

---