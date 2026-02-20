export interface KnowledgeChunk {
  title: string;
  content: string;
}

const MAX_CHARS = 2000; // ~500-700 tokens safe size

export function chunkMarkdown(
  fileName: string,
  markdown: string
): KnowledgeChunk[] {
  const sections = markdown.split(/\n##\s+/g);

  const chunks: KnowledgeChunk[] = [];

  for (let section of sections) {
    if (!section.trim()) continue;

    const lines = section.split("\n");
    const heading = lines[0].trim();
    const body = lines.slice(1).join("\n").trim();

    if (!body) continue;

    if (body.length <= MAX_CHARS) {
      chunks.push({
        title: `${fileName} — ${heading}`,
        content: body,
      });
    } else {
      // Split oversized section
      for (let i = 0; i < body.length; i += MAX_CHARS) {
        const slice = body.slice(i, i + MAX_CHARS);
        chunks.push({
          title: `${fileName} — ${heading} (part ${Math.floor(i / MAX_CHARS) + 1})`,
          content: slice,
        });
      }
    }
  }

  return chunks;
}
