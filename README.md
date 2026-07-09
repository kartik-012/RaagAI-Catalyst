<div align="center">
  <h1>⚡ RagaAI Catalyst — Enterprise LLM Observability Platform</h1>
  
  <p>
    <strong>A next-generation, high-performance web dashboard for LLM evaluation, tracing, and guardrails.</strong>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#contributing">Contributing</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14.2.5-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-11.3-black?style=flat-square&logo=framer" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  </p>
</div>

<br/>

## 🎯 Overview

RagaAI Catalyst is an enterprise-grade LLM operations (LLMOps) platform. This repository contains the official frontend web application, built with a modern React stack to provide a blazing-fast, secure, and intuitive interface for AI engineers and data scientists.

Whether you are tracing complex agentic workflows, running offline evaluations, or configuring real-time safety guardrails, this dashboard provides complete visibility and control over your generative AI applications.

---

## ✨ Core Features

*   **🔍 Agentic Tracing:** Deep introspection into LLM pipelines (LangChain, LlamaIndex, OpenAI, CrewAI). Monitor latency, token usage, and step-by-step agent decisions.
*   **🧪 Advanced Evaluations:** Execute robust offline evaluations using 20+ built-in metrics including Faithfulness, Hallucination, and Context Relevance.
*   **🛡️ Dynamic Guardrails:** Configure and deploy real-time guardrails to prevent PII leakage, toxicity, and prompt injections.
*   **🗄️ Dataset Management:** Upload, version, and manage golden datasets for continuous testing and fine-tuning.
*   **⚔️ Automated Red Teaming:** Run adversarial testing suites to uncover vulnerabilities in your LLM models before production deployment.
*   **🧬 Synthetic Data Generation:** Seamlessly generate domain-specific training data utilizing state-of-the-art foundation models.



## 🏗️ Architecture & Tech Stack

This application is built with a focus on performance, type safety, and exceptional user experience.

### Frontend Stack
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Radix UI Primitives
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization:** [Recharts](https://recharts.org/)

### Security & Performance
- **Edge Routing:** Optimized route segment configs.
- **Client-side Caching:** Intelligent query invalidation via React Query.
- **Responsive Design:** Mobile-first approach scaling seamlessly to 4K desktop environments.
- **Accessibility:** Fully ARIA compliant utilizing Radix UI primitives.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.17.0 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-org/ragaai-catalyst-dashboard.git
cd ragaai-catalyst-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the template environment file and add your Catalyst API credentials.
```bash
cp .env.example .env.local
```
Update `.env.local`:
```env
NEXT_PUBLIC_RAGAAI_BASE_URL=https://api.catalyst.raga.ai/v1
```

### 4. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## 🚢 Deployment

This project is optimized for deployment on Vercel, but can be containerized or hosted on any Node.js environment.

### Production Build
To create an optimized production build:
```bash
npm run build
npm run start
```

### Docker Deployment
*(Dockerfile coming soon)*

---

## 📁 Directory Structure

```text
ragaai-catalyst-dashboard/
├── src/
│   ├── app/                 # Next.js App Router Pages & API Routes
│   ├── components/          # Reusable UI components (Layout, UI primitives, Feature-specific)
│   ├── lib/                 # Utility functions (Tailwind merge, formatting)
│   ├── services/            # API client wrappers and endpoint definitions
│   ├── store/               # Zustand global state slices
│   └── types/               # Global TypeScript interfaces and types
├── public/                  # Static assets (images, fonts, icons)
├── tailwind.config.ts       # Tailwind theme and plugin configuration
└── package.json             # Project dependencies and scripts
```

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
