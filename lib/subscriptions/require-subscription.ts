// lib/subscriptions/require-subscription.ts

import { validateSubscription } from "./subscription-service";

export async function requireSubscription(userId: string) {
  const result = await validateSubscription(userId);

  if (!result.valid) {
    return { valid: false, error: result.reason };
  }

  return { valid: true, error: null };
}