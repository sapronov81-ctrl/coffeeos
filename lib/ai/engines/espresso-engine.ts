// lib/ai/engines/espresso-engine.ts

import { retrieveRelevantChunks } from "@/lib/ai/rag/retrieve";
import { createEmbedding } from "@/lib/ai/embeddings";

export interface EspressoEngineInput {
  userId: string;
  message: string;
  subscriptionLevel: string;
}

export interface EspressoEngineResult {
  intent: string;
  response: string;
  tokensUsed: number;
}

function deduplicateChunks(chunks: string[]): string[] {
  return [...new Set(chunks)];
}

function compressContext(chunks: string[], maxChars: number = 3000): string {
  let combined = "";
  for (const chunk of chunks) {
    if (combined.length + chunk.length > maxChars) break;
    combined += chunk + "\n\n";
  }
  return combined.trim();
}

export async function runEspressoEngine(
  input: EspressoEngineInput
): Promise<EspressoEngineResult> {
  try {
    const embedding = await createEmbedding(input.message);

    const rawChunks = await retrieveRelevantChunks(
      embedding,
      input.subscriptionLevel,
      10
    );

    const deduped = deduplicateChunks(rawChunks.map((c) => c.content));

    const context = compressContext(deduped);

    const structuredResponse = `
Espresso Analysis

User Input:
${input.message}

Knowledge Context:
${context || "No relevant knowledge found."}

Reasoning:
- Short extraction time may indicate under-extraction.
- Sour taste often correlates with insufficient extraction.
- Natural processing may influence density and flow behavior.

Status:
(LLM disabled — deterministic reasoning mode active)
`;

    return {
      intent: "espresso",
      response: structuredResponse,
      tokensUsed: 0,
    };
  } catch (error) {
    console.error("Espresso engine error:", error);

    return {
      intent: "espresso",
      response: "AI engine error.",
      tokensUsed: 0,
    };
  }
}