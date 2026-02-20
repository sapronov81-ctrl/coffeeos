import "./bootstrap-env";
import dotenv from "dotenv";
import path from "path";
import { ingestMarkdownFile } from "@/lib/ai/knowledge-pipeline";

dotenv.config({
  path: path.resolve(".env.local"),
});

async function run() {
  const basePath = path.resolve("data/knowledge");

  await ingestMarkdownFile(path.join(basePath, "bean_density.md"));
  await ingestMarkdownFile(path.join(basePath, "bean_hardness.md"));
  await ingestMarkdownFile(path.join(basePath, "espresso_basics.md"));
  await ingestMarkdownFile(path.join(basePath, "espresso_recipes.md"));
  await ingestMarkdownFile(path.join(basePath, "grinders_mythos.md"));
  await ingestMarkdownFile(path.join(basePath, "processing_methods_arabica.md"));

  console.log("Knowledge ingestion complete.");
}

run();
