import { requireUser } from "@/lib/auth/require-user";
import { requireActiveSubscription } from "@/lib/subscriptions/require-active-subscription";
import { requireUsageLimit } from "@/lib/subscriptions/require-usage-limit";

export interface AIRequestContext {
  userId: string;
  subscriptionLevel: string;
}

export async function buildAIRequestContext(request: Request): Promise<AIRequestContext> {
  const user = await requireUser(request);

  await requireActiveSubscription(user.id);

  await requireUsageLimit(user.id);

  return {
    userId: user.id,
    subscriptionLevel: user.subscription_level,
  };
}
