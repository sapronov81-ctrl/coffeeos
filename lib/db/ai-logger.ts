// lib/db/ai-logger.ts

import { supabaseAdmin } from "./supabase-server";

interface LogAIRequestParams {
  userId: string;
  intent: string;
  tokensUsed: number;
  executionTime: number;
  blockedReason: string | null;
}

export async function logAIRequest(params: LogAIRequestParams) {
  const { error } = await supabaseAdmin.from("ai_logs").insert({
    user_id: params.userId,
    intent: params.intent,
    tokens_used: params.tokensUsed,
    execution_time: params.executionTime,
    blocked_reason: params.blockedReason,
  });

  if (error) {
    console.error("AI log insert error:", error);
  }
}
