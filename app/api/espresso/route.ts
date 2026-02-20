import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { requireActiveSubscription } from "@/lib/subscriptions/require-active-subscription";
import { requireUsageLimit } from "@/lib/subscriptions/require-usage-limit";
import { logAIRequest } from "@/lib/logging/ai-logger";
import { runEspressoEngine } from "@/lib/ai/engines/espresso-engine";

export async function GET(request: Request) {
  const start = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const message = searchParams.get("message");

    if (!message) {
      return NextResponse.json(
        { error: "Missing message parameter" },
        { status: 400 }
      );
    }

    const user = await requireUser(request);

    const subscription = await requireActiveSubscription(user.id);

    await requireUsageLimit(user.id, subscription.level);

    // 🔵 Run AI Engine (mock + RAG)
    const aiResult = await runEspressoEngine({
      userId: user.id,
      message,
      subscriptionLevel: subscription.level,
    });

    const executionTime = Date.now() - start;

    await logAIRequest({
      userId: user.id,
      intent: aiResult.intent,
      subscriptionLevel: subscription.level,
      executionTimeMs: executionTime,
    });

    return NextResponse.json(
      {
        response: aiResult.response,
        tokensUsed: aiResult.tokensUsed,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }

    console.error("Espresso endpoint error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}