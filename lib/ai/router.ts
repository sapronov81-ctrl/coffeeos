// lib/ai/router.ts

import { classifyIntent } from "./intent-classifier";
import { runEspressoEngine } from "./engines/espresso-engine";
import { runCalibrationEngine } from "./engines/calibration-engine";
import { runTrainingEngine } from "./engines/training-engine";

export interface RouteIntentInput {
  userId: string;
  message: string;
}

export interface RouteIntentResult {
  intent: string;
  response: string;
  tokensUsed?: number;
}

export async function routeIntent(
  input: RouteIntentInput
): Promise<RouteIntentResult> {
  const intent = await classifyIntent(input.message);

  switch (intent) {
    case "espresso":
      return runEspressoEngine({
        userId: input.userId,
        message: input.message,
      });

    case "calibration":
      return runCalibrationEngine({
        userId: input.userId,
        message: input.message,
      });

    case "training":
      return runTrainingEngine({
        userId: input.userId,
        message: input.message,
      });

    case "non_coffee":
      throw new Error("Non-coffee query blocked");

    default:
      return {
        intent: "chat",
        response: "Unsupported intent",
        tokensUsed: 0,
      };
  }
}
