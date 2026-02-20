import fs from "fs/promises";
import path from "path";
import { supabaseAdmin } from "@/lib/db/supabase-server";
import { createEmbedding } from "./embeddings";
import { chunkMarkdown } from "./chunk-markdown";

function generateMockEmbedding(): number[] {
  return Array(1536).fill(0);
}

export async function ingestMarkdownFile(
  filePath: string
): Promise<void> {
  const absolutePath = path.resolve(filePath);
  const fileName = path.basename(filePath);

  const content = await fs.readFile(absolutePath, "utf-8");

  const chunks = chunkMarkdown(fileName, content);

  // 🔴 Удаляем старые чанки этого файла
  await supabaseAdmin
    .from("knowledge_chunks")
    .delete()
    .eq("source", fileName);

  for (const chunk of chunks) {
    let embedding: number[];

    if (process.env.AI_MODE === "live") {
      embedding = await createEmbedding(chunk.content);
    } else {
      embedding = generateMockEmbedding();
    }

    const { error } = await supabaseAdmin
      .from("knowledge_chunks")
      .insert({
        content: chunk.content,
        embedding,
        tier_access: "basic", // можно потом сделать автоопределение
        source: fileName,
      });

    if (error) {
      console.error("Ingestion error:", error);
    }
  }

  console.log(
    `Ingested ${chunks.length} chunks from ${fileName}`
  );
}