// lib/ai/rag/retrieve.ts

import { supabaseAdmin } from "@/lib/db/supabase-server";

export interface RetrievedChunk {
  id: string;
  content: string;
  similarity: number;
}

export async function retrieveRelevantChunks(
  embedding: number[],
  subscriptionLevel: string,
  topK: number = 5
): Promise<RetrievedChunk[]> {
  const { data, error } = await supabaseAdmin.rpc(
    "match_knowledge_chunks",
    {
      query_embedding: embedding,
      match_count: topK,
      user_tier: subscriptionLevel,
    }
  );

  if (error) {
    console.error("RAG retrieval error:", error);
    return [];
  }

  return data ?? [];
}