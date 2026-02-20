// app/api/ai/route.ts

import { NextResponse } from "next/server";
import { buildAIRequestContext } from "@/lib/context/build-ai-context";
import { routeIntent } from "@/lib/ai/router";
import { logAIRequest } from "@/lib/db/ai-logger";

export async function POST(request: Request) {
  const start = Date.now();

  try {
    const context = await buildAIRequestContext(request);

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    const result = await routeIntent({
      userId: context.userId,
      message,
    });

    const executionTime = Date.now() - start;

    await logAIRequest({
      userId: context.userId,
      intent: result.intent,
      tokensUsed: result.tokensUsed ?? 0,
      executionTime,
      blockedReason: null,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const executionTime = Date.now() - start;

    try {
      await logAIRequest({
        userId: "unknown",
        intent: "blocked",
        tokensUsed: 0,
        executionTime,
        blockedReason: error?.message ?? "Unknown error",
      });
    } catch (_) {}

    return NextResponse.json(
      { error: error?.message ?? "Internal error" },
      { status: 403 }
    );
  }
}
