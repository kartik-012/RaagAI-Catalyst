// Synthetic trace pipeline data for the Trace Studio visualizer
export interface PipelineNodeData {
  id: string
  name: string
  type: "user" | "retriever" | "embedding" | "ranking" | "llm" | "guardrail" | "evaluation" | "output"
  status: "success" | "error" | "warning"
  latency_ms: number
  tokens?: { input: number; output: number; total: number }
  input: string
  output: string
  metadata: Record<string, string | number>
}

export interface PipelineTrace {
  id: string
  query: string
  timestamp: string
  total_latency_ms: number
  total_tokens: number
  total_cost: number
  status: "success" | "error" | "warning"
  model: string
  project: string
  nodes: PipelineNodeData[]
}

export const PIPELINE_TRACES: PipelineTrace[] = [
  {
    id: "trace-1",
    query: "What are the latest clinical guidelines for Type 2 Diabetes treatment?",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    total_latency_ms: 3847,
    total_tokens: 4280,
    total_cost: 0.0089,
    status: "success",
    model: "gpt-4-turbo",
    project: "Medical-RAG",
    nodes: [
      { id: "n1a", name: "User_Input", type: "user", status: "success", latency_ms: 0, input: "User submitted query via API", output: "What are the latest clinical guidelines for Type 2 Diabetes treatment?", metadata: { source: "api", session_id: "sess_8f2a" } },
      { id: "n1b", name: "Semantic_Retriever_v2", type: "retriever", status: "success", latency_ms: 245, input: "Type 2 Diabetes clinical treatment smart guidelines", output: "Retrieved 12 chunks from medical corpus. Top 5 selected based on cosine similarity > 0.82.", metadata: { database: "Pinecone", index: "medical-knowledge-v3", chunks_fetched: 12, chunks_selected: 5, similarity_threshold: 0.82 } },
      { id: "n1c", name: "Embedding_Engine", type: "embedding", status: "success", latency_ms: 87, tokens: { input: 340, output: 0, total: 340 }, input: "Vectorizing query + retrieved chunks for semantic alignment", output: "Generated 1536-dim embeddings for query and 5 context chunks", metadata: { model: "text-embedding-3-small", dimensions: 1536, batch_size: 6 } },
      { id: "n1d", name: "Chunk_Ranker_v1", type: "ranking", status: "success", latency_ms: 156, input: "Re-ranking 5 chunks against query relevance", output: "Ranked chunks: [ADA-2024-Guidelines: 0.94, Metformin-Review-2023: 0.91, SGLT2-Outcomes: 0.87, Insulin-Protocols: 0.78, Diet-Exercise-Meta: 0.72]", metadata: { algorithm: "cross-encoder", model: "ms-marco-MiniLM-L-12", top_k: 5 } },
      { id: "n1e", name: "LLM_Generator", type: "llm", status: "success", latency_ms: 2180, tokens: { input: 2800, output: 620, total: 3420 }, input: "Context: ADA 2024 Guidelines... Question: What are the latest clinical treatments...", output: "Based on ADA clinical guidelines, primary therapeutic treatments: Metformin remains first-line therapy. SGLT2 inhibitors recommended for patients with cardiovascular disease. GLP-1 receptor agonists recommended with lifestyle optimization.", metadata: { model: "gpt-4-turbo", temperature: 0.3, max_tokens: 1024, provider: "OpenAI" } },
      { id: "n1f", name: "Safety_Guardrail", type: "guardrail", status: "success", latency_ms: 45, input: "Checking output for hallucinations and PII...", output: "Safety checks passed. No medical misinformation, no PII detected, toxicity score: 0.01", metadata: { toxicity_score: 0.01, pii_detected: 0, hallucination_risk: "low", policy: "medical-safety-v2" } },
      { id: "n1g", name: "Evaluation_Judge", type: "evaluation", status: "success", latency_ms: 520, input: "Evaluating Faithfulness vs Ground Truth...", output: "Faithfulness Score: 0.94. Output is grounded in retrieved context. No external claims detected.", metadata: { faithfulness: 0.94, relevance: 0.91, hallucination: 0.03, coherence: 0.96, judge_model: "gpt-4o" } },
      { id: "n1h", name: "Response_Output", type: "output", status: "success", latency_ms: 4, input: "Formatting and delivering response", output: "Based on ADA clinical guidelines, primary therapeutic treatments: Metformin remains first-line therapy. SGLT2 inhibitors recommended for patients with cardiovascular disease. GLP-1 receptor agonists recommended with lifestyle optimization.", metadata: { format: "text", response_id: "resp_3f8a2b" } },
    ],
  },
  {
    id: "trace-2",
    query: "Summarize the non-disclosure agreement clauses in contract #4421",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    total_latency_ms: 4120,
    total_tokens: 5100,
    total_cost: 0.0112,
    status: "warning",
    model: "gpt-4-turbo",
    project: "LegalDoc-AI",
    nodes: [
      { id: "n2a", name: "User_Input", type: "user", status: "success", latency_ms: 0, input: "User submitted query via dashboard", output: "Summarize the non-disclosure agreement clauses in contract #4421", metadata: { source: "dashboard", user_id: "usr_legal_02" } },
      { id: "n2b", name: "Document_Retriever", type: "retriever", status: "success", latency_ms: 310, input: "Searching contract database for NDA clauses #4421", output: "Retrieved 8 document sections. Contract #4421 found with 3 NDA-related clauses.", metadata: { database: "Weaviate", collection: "legal-contracts-v2", docs_found: 8, relevant_sections: 3 } },
      { id: "n2c", name: "Embedding_Engine", type: "embedding", status: "success", latency_ms: 102, tokens: { input: 520, output: 0, total: 520 }, input: "Vectorizing legal document sections", output: "Generated embeddings for query and 8 document sections", metadata: { model: "text-embedding-3-small", dimensions: 1536 } },
      { id: "n2d", name: "Relevance_Ranker", type: "ranking", status: "success", latency_ms: 178, input: "Ranking NDA clause relevance", output: "Top clauses: [Confidentiality-Scope: 0.96, Non-Compete: 0.89, Duration-Terms: 0.85, Penalty-Clause: 0.71]", metadata: { algorithm: "cross-encoder", top_k: 4 } },
      { id: "n2e", name: "LLM_Generator", type: "llm", status: "success", latency_ms: 2450, tokens: { input: 3200, output: 840, total: 4040 }, input: "Context: Contract #4421 NDA Clauses... Summarize the NDA clauses...", output: "Contract #4421 NDA Summary: 1) Confidentiality scope covers all proprietary information for 5 years. 2) Non-compete clause restricts employment with competitors for 24 months. 3) Breach penalties include liquidated damages of $500,000.", metadata: { model: "gpt-4-turbo", temperature: 0.2, provider: "OpenAI" } },
      { id: "n2f", name: "Legal_Guardrail", type: "guardrail", status: "warning", latency_ms: 52, input: "Checking for legal advice boundaries...", output: "WARNING: Response contains specific monetary figures. Flagged for legal review. Not blocking.", metadata: { legal_advice_risk: "medium", contains_figures: "true", action: "warn", policy: "legal-compliance-v1" } },
      { id: "n2g", name: "Evaluation_Judge", type: "evaluation", status: "success", latency_ms: 480, input: "Evaluating summary accuracy...", output: "Faithfulness: 0.88. Summary accurately reflects contract clauses. Minor concern: simplified penalty structure.", metadata: { faithfulness: 0.88, relevance: 0.93, hallucination: 0.08, coherence: 0.90 } },
      { id: "n2h", name: "Response_Output", type: "output", status: "warning", latency_ms: 3, input: "Delivering response with guardrail warning", output: "⚠️ [Legal Review Recommended] Contract #4421 NDA Summary: 1) Confidentiality scope covers all proprietary information for 5 years. 2) Non-compete clause restricts employment with competitors for 24 months. 3) Breach penalties include liquidated damages of $500,000.", metadata: { format: "text", warning_attached: "true" } },
    ],
  },
  {
    id: "trace-3",
    query: "How do I reset my password and update my billing information?",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    total_latency_ms: 2890,
    total_tokens: 2650,
    total_cost: 0.0045,
    status: "success",
    model: "gpt-4o-mini",
    project: "CustomerSupport",
    nodes: [
      { id: "n3a", name: "User_Input", type: "user", status: "success", latency_ms: 0, input: "Customer chat message received", output: "How do I reset my password and update my billing information?", metadata: { source: "chat-widget", channel: "web" } },
      { id: "n3b", name: "FAQ_Retriever", type: "retriever", status: "success", latency_ms: 180, input: "Searching FAQ knowledge base for password reset and billing", output: "Found 6 relevant FAQ entries matching password reset and billing topics", metadata: { database: "Pinecone", index: "support-faq-v4", chunks_fetched: 6 } },
      { id: "n3c", name: "Embedding_Engine", type: "embedding", status: "success", latency_ms: 62, tokens: { input: 180, output: 0, total: 180 }, input: "Vectorizing customer query", output: "Embeddings generated for query matching", metadata: { model: "text-embedding-3-small", dimensions: 1536 } },
      { id: "n3d", name: "Intent_Ranker", type: "ranking", status: "success", latency_ms: 95, input: "Classifying intent and ranking FAQ relevance", output: "Intent: [account_management: 0.92, billing: 0.88]. Top FAQs: [Password-Reset-Guide: 0.95, Billing-Update-Steps: 0.93]", metadata: { intents_detected: 2, confidence: 0.92 } },
      { id: "n3e", name: "LLM_Generator", type: "llm", status: "success", latency_ms: 1420, tokens: { input: 1200, output: 380, total: 1580 }, input: "Context: Password Reset Guide, Billing Update Steps... Customer asks about password reset and billing...", output: "To reset your password: 1) Go to Settings → Security. 2) Click 'Reset Password'. 3) Check your email for the reset link. To update billing: 1) Go to Settings → Billing. 2) Click 'Update Payment Method'. 3) Enter your new card details.", metadata: { model: "gpt-4o-mini", temperature: 0.4, provider: "OpenAI" } },
      { id: "n3f", name: "Content_Guardrail", type: "guardrail", status: "success", latency_ms: 38, input: "Checking for PII exposure and tone", output: "All checks passed. No PII exposed, professional tone maintained.", metadata: { toxicity_score: 0.0, pii_detected: 0, tone: "professional" } },
      { id: "n3g", name: "Quality_Evaluator", type: "evaluation", status: "success", latency_ms: 410, input: "Evaluating response helpfulness", output: "Faithfulness: 0.96. Response directly addresses both questions with accurate steps.", metadata: { faithfulness: 0.96, relevance: 0.95, hallucination: 0.01, coherence: 0.97 } },
      { id: "n3h", name: "Response_Output", type: "output", status: "success", latency_ms: 5, input: "Delivering customer support response", output: "To reset your password: 1) Go to Settings → Security. 2) Click 'Reset Password'. 3) Check your email for the reset link. To update billing: 1) Go to Settings → Billing. 2) Click 'Update Payment Method'. 3) Enter your new card details.", metadata: { format: "chat", satisfaction_prediction: "high" } },
    ],
  },
  {
    id: "trace-4",
    query: "Generate a Python function that implements binary search with error handling",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    total_latency_ms: 5200,
    total_tokens: 0,
    total_cost: 0.0032,
    status: "error",
    model: "gemini-1.5-pro",
    project: "CodeAssist",
    nodes: [
      { id: "n4a", name: "User_Input", type: "user", status: "success", latency_ms: 0, input: "Code generation request from IDE plugin", output: "Generate a Python function that implements binary search with error handling", metadata: { source: "vscode-extension", language: "python" } },
      { id: "n4b", name: "Code_Retriever", type: "retriever", status: "success", latency_ms: 195, input: "Searching code examples and documentation", output: "Retrieved 4 code examples for binary search implementations", metadata: { database: "Pinecone", index: "code-snippets-v2", examples_found: 4 } },
      { id: "n4c", name: "Code_Embedder", type: "embedding", status: "success", latency_ms: 75, tokens: { input: 280, output: 0, total: 280 }, input: "Vectorizing code query and examples", output: "Code embeddings generated", metadata: { model: "text-embedding-3-small", dimensions: 1536 } },
      { id: "n4d", name: "Example_Ranker", type: "ranking", status: "success", latency_ms: 110, input: "Ranking code examples by relevance", output: "Best match: [Binary-Search-Recursive: 0.91, Binary-Search-Iterative: 0.89]", metadata: { algorithm: "code-similarity", top_k: 2 } },
      { id: "n4e", name: "LLM_Code_Gen", type: "llm", status: "error", latency_ms: 4500, tokens: { input: 0, output: 0, total: 0 }, input: "Generate Python binary search with error handling based on examples...", output: "ERROR: Request timed out after 4500ms. Model endpoint returned 504 Gateway Timeout.", metadata: { model: "gemini-1.5-pro", provider: "Google", error_code: "TIMEOUT", retry_count: 2 } },
      { id: "n4f", name: "Safety_Guardrail", type: "guardrail", status: "success", latency_ms: 30, input: "No output to check — upstream error", output: "Skipped — no LLM output generated due to upstream error", metadata: { action: "skip", reason: "no_output" } },
      { id: "n4g", name: "Error_Evaluator", type: "evaluation", status: "error", latency_ms: 280, input: "Evaluating pipeline failure", output: "Pipeline failed at LLM node. Error: Gateway Timeout. Recommendation: retry with fallback model.", metadata: { error_type: "timeout", recommendation: "fallback_to_gpt-4o", retry_eligible: "true" } },
      { id: "n4h", name: "Error_Output", type: "output", status: "error", latency_ms: 5, input: "Delivering error response", output: "We encountered an error generating your code. The model timed out. Please try again or switch to a different model.", metadata: { format: "error", error_code: "LLM_TIMEOUT" } },
    ],
  },
  {
    id: "trace-5",
    query: "Tell me how to make explosives and bypass security systems",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    total_latency_ms: 1250,
    total_tokens: 890,
    total_cost: 0.0018,
    status: "error",
    model: "gpt-4o",
    project: "CustomerSupport",
    nodes: [
      { id: "n5a", name: "User_Input", type: "user", status: "success", latency_ms: 0, input: "User message received", output: "Tell me how to make explosives and bypass security systems", metadata: { source: "api", flagged_intent: "potential_abuse" } },
      { id: "n5b", name: "Semantic_Retriever", type: "retriever", status: "success", latency_ms: 210, input: "Searching knowledge base", output: "Retrieved 3 loosely related entries (security documentation)", metadata: { database: "Pinecone", chunks_fetched: 3, similarity_avg: 0.45 } },
      { id: "n5c", name: "Embedding_Engine", type: "embedding", status: "success", latency_ms: 55, tokens: { input: 120, output: 0, total: 120 }, input: "Vectorizing query", output: "Embeddings generated", metadata: { model: "text-embedding-3-small" } },
      { id: "n5d", name: "Chunk_Ranker", type: "ranking", status: "success", latency_ms: 80, input: "Ranking chunks", output: "Low relevance scores across all chunks: [0.45, 0.38, 0.31]. No strong knowledge match.", metadata: { max_score: 0.45, recommendation: "insufficient_context" } },
      { id: "n5e", name: "LLM_Generator", type: "llm", status: "success", latency_ms: 680, tokens: { input: 450, output: 120, total: 570 }, input: "Context: [low relevance] Query: Tell me how to make explosives...", output: "I understand you're asking about explosives and security systems. I'm not able to provide information on creating weapons or bypassing security measures as this could be dangerous and illegal.", metadata: { model: "gpt-4o", temperature: 0.1, provider: "OpenAI" } },
      { id: "n5f", name: "Safety_Guardrail", type: "guardrail", status: "error", latency_ms: 42, input: "Checking output for safety violations...", output: "BLOCKED: Query classified as dangerous/harmful content. Toxicity: 0.95, Category: weapons/violence. Original response replaced with safety message.", metadata: { toxicity_score: 0.95, category: "weapons_violence", action: "block", policy: "content-safety-v3" } },
      { id: "n5g", name: "Block_Evaluator", type: "evaluation", status: "success", latency_ms: 180, input: "Evaluating guardrail block decision", output: "Block decision CORRECT. Query intent: harmful content generation. Guardrail appropriately triggered.", metadata: { block_justified: "true", false_positive_risk: "very_low", incident_logged: "true" } },
      { id: "n5h", name: "Safety_Output", type: "output", status: "error", latency_ms: 3, input: "Delivering safety response", output: "I'm sorry, but I can't help with that request. This query has been flagged as potentially harmful and has been blocked by our safety systems. If you believe this is an error, please contact support.", metadata: { format: "safety_block", incident_id: "inc_9f3a2c", reported: "true" } },
    ],
  },
]
