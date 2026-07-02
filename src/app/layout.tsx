import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "RagaAI Catalyst — LLM Observability Platform",
  description: "Enterprise-grade LLM evaluation, tracing, and guardrails platform",
}

import { WaveBackground } from "@/components/ui/WaveBackground"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative">
        <WaveBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
