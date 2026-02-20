import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { requireActiveSubscription } from "@/lib/subscriptions/require-active-subscription";
import { requireUsageLimit } from "@/lib/subscriptions/require-usage-limit";
import { classifyIntent } from "@/lib/ai/intent/classify-intent";
import { logAIRequest } from "@/lib/logging/ai-logger";
import { z } from "zod";

const schema = z.object({
  message: z.string().min(1),
});

export async function POST(request: Request) {
  const start = Date.now();

  try {
    const user = await requireUser(request);

    const subscription = await requireActiveSubscription(user.id);

    await requireUsageLimit(user.id, subscription.level);

    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { message } = parsed.data;

    const result = await classifyIntent(message);

    const executionTime = Date.now() - start;

    await logAIRequest({
      userId: user.id,
      intent: "intent_classifier",
      subscriptionLevel: subscription.level,
      tokensUsed: result.tokensUsed,
      executionTimeMs: executionTime,
    });

    return NextResponse.json(
      {
        intent: result.intent,
        confidence: result.confidence,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }

    console.error("Intent endpoint error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}