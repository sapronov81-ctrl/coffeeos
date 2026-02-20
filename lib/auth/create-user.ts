// lib/auth/create-user.ts

import { supabaseAdmin } from "@/lib/db/supabase-server";
import { SubscriptionLevel } from "@/types/user";

export async function createUserRecord(userId: string): Promise<void> {
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 1);

  const { error } = await supabaseAdmin.from("users").insert({
    id: userId,
    role: "owner",
    subscription_level: "trial" as SubscriptionLevel,
    trial_ends_at: trialEndsAt.toISOString(),
  });

  if (error) {
    console.error("Error creating user record:", error);
    throw new Error("Failed to create user record.");
  }
}
