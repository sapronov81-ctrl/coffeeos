import { supabaseAdmin } from "@/lib/db/supabase-server";
import { createEmbedding } from "./embeddings";

export async function ingestKnowledge(
  title: string,
  content: string
): Promise<void> {
  const embedding = await createEmbedding(content);

  const { error } = await supabaseAdmin
    .from("knowledge_base")
    .insert({
      title,
      content,
      embedding,
    });

  if (error) {
    throw new Error("Knowledge ingestion failed: " + error.message);
  }
}
