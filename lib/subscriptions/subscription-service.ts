import { supabaseAdmin } from "@/lib/db/supabase-server";
import { User } from "@/types/user";

export interface SubscriptionValidationResult {
  valid: boolean;
  level: string | null;
  reason?: string;
}

export async function validateSubscription(
  userId: string
): Promise<SubscriptionValidationResult> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId);

  if (error) {
    console.error("Subscription query error:", error);
    return { valid: false, level: null, reason: "Database error" };
  }

  if (!data || data.length === 0) {
    console.error("User not found in public.users:", userId);
    return { valid: false, level: null, reason: "User not found" };
  }

  const user = data[0] as User;

  if (!user.subscription_level) {
    return { valid: false, level: null, reason: "No subscription" };
  }

  // Trial expiration
  if (user.subscription_level === "trial") {
    if (!user.trial_ends_at) {
      return { valid: false, level: "trial", reason: "Trial data missing" };
    }

    const now = new Date();
    const trialEnd = new Date(user.trial_ends_at);

    if (now > trialEnd) {
      return { valid: false, level: "trial", reason: "Trial expired" };
    }
  }

  return {
    valid: true,
    level: user.subscription_level,
  };
}