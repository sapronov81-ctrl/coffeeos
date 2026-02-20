import { INTENT_KEYWORDS } from "./intent-keywords";
import { AppIntent, IntentResult } from "./intent-types";

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sа-яА-Я]/g, "")
    .split(" ")
    .filter((w) => w.length > 2);
}

export async function classifyIntent(
  input: string
): Promise<IntentResult> {
  const words = normalize(input);

  let bestIntent: AppIntent = "chat";
  let bestScore = 0;

  for (const intent in INTENT_KEYWORDS) {
    const keywords = INTENT_KEYWORDS[intent as AppIntent];

    let score = 0;

    for (const word of words) {
      if (keywords.some((k) => word.includes(k))) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent as AppIntent;
    }
  }

  const confidence =
    words.length === 0 ? 0 : bestScore / words.length;

  return {
    intent: bestScore === 0 ? "chat" : bestIntent,
    confidence,
    tokensUsed: 0,
  };
}