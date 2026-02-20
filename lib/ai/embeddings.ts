import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEmbedding(
  text: string
): Promise<number[]> {
  if (process.env.EMBEDDINGS_MODE !== "live") {
    return Array(1536).fill(0);
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Embedding fallback activated:", error);
    return Array(1536).fill(0);
  }
}