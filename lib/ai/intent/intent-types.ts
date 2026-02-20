export type AppIntent =
  | "calibration"
  | "training"
  | "audit"
  | "menu"
  | "settings"
  | "chat";

export interface IntentResult {
  intent: AppIntent;
  confidence: number;
  tokensUsed: number;
}