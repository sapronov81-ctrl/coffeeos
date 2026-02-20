import { supabaseAdmin } from "@/lib/db/supabase-server";

export interface AILogPayload {
  userId: string;
  intent: string;
  subscriptionLevel?: string;
  tokensUsed?: number;
  executionTimeMs?: number;
  blockedReason?: string;
}

export async function logAIRequest(payload: AILogPayload): Promise<void> {
  const {
    userId,
    intent,
    subscriptionLevel,
    tokensUsed,
    executionTimeMs,
    blockedReason,
  } = payload;

  const { error } = await supabaseAdmin
    .from("ai_logs")
    .insert({
      user_id: userId,
      intent,
      subscription_level: subscriptionLevel ?? null,
      tokens_used: tokensUsed ?? null,
      execution_time: executionTimeMs ?? null,
      blocked_reason: blockedReason ?? null,
    });

  if (error) {
    console.error("AI log insert error:", error);
  }
}
