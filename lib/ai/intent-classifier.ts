import { openai } from "./openai-client";

export type IntentType =
  | "espresso"
  | "calibration"
  | "training"
  | "troubleshooting"
  | "unknown";

export interface IntentResult {
  intent: IntentType;
  tokensUsed: number;
}

const SYSTEM_PROMPT = `
You are an AI intent classifier for a coffee shop SaaS platform.

Classify the user's message into exactly one of the following intents:

- espresso
- calibration
- training
- troubleshooting
- unknown

Return ONLY valid JSON:

{
  "intent": "espresso"
}
`;

function mockIntent(message: string): IntentResult {
  const lower = message.toLowerCase();

  if (lower.includes("espresso") || lower.includes("bitter")) {
    return { intent: "espresso", tokensUsed: 5 };
  }

  if (lower.includes("calibration")) {
    return { intent: "calibration", tokensUsed: 5 };
  }

  if (lower.includes("train")) {
    return { intent: "training", tokensUsed: 5 };
  }

  if (lower.includes("error") || lower.includes("problem")) {
    return { intent: "troubleshooting", tokensUsed: 5 };
  }

  return { intent: "unknown", tokensUsed: 5 };
}

export async function classifyIntent(
  message: string
): Promise<IntentResult> {
  if (process.env.AI_MODE === "mock") {
    return mockIntent(message);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "{}";

  let parsed: { intent: IntentType };

  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { intent: "unknown" };
  }

  return {
    intent: parsed.intent ?? "unknown",
    tokensUsed: response.usage?.total_tokens ?? 0,
  };
}
