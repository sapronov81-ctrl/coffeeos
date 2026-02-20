import { supabaseAdmin } from "@/lib/db/supabase-server";
import { getSubscriptionLimits } from "./subscription-limits";

export async function requireUsageLimit(
  userId: string,
  subscriptionLevel: string | null
): Promise<void> {
  const limits = getSubscriptionLimits(subscriptionLevel);

  if (limits.maxRequestsPerDay === 0) {
    throw new Response(
      JSON.stringify({ error: "No active subscription" }),
      { status: 403 }
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabaseAdmin
    .from("ai_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", today.toISOString());

  if (error) {
    console.error("Usage count error:", error);
    throw new Response(
      JSON.stringify({ error: "Usage check failed" }),
      { status: 500 }
    );
  }

  if ((count ?? 0) >= limits.maxRequestsPerDay) {
    throw new Response(
      JSON.stringify({ error: "Daily request limit exceeded" }),
      { status: 403 }
    );
  }
}
