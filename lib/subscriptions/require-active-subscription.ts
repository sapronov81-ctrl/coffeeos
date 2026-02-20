import { validateSubscription } from "./subscription-service";

export async function requireActiveSubscription(userId: string) {
  const result = await validateSubscription(userId);

  if (!result.valid) {
    throw new Response(
      JSON.stringify({ error: result.reason }),
      { status: 403 }
    );
  }

  return result;
}
