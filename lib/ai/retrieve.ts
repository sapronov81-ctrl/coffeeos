import { supabaseAdmin } from "@/lib/db/supabase-server";
import { createEmbedding } from "./embeddings";

export async function retrieveContext(
  query: string,
  topK: number = 8
): Promise<string[]> {
  if (!query.trim()) {
    return [];
  }

  const embedding = await createEmbedding(query);

  const { data, error } = await supabaseAdmin.rpc(
    "match_knowledge_chunks",
    {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: topK,
    }
  );

  if (error) {
    console.error("Vector retrieval error:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((row: any) => row.content);
}