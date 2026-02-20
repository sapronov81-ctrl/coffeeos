export interface ShotInput {
  dose: number; // grams
  yield: number; // grams
  time: number; // seconds
  taste: "sour" | "bitter" | "balanced";
}

export interface ShotAnalysis {
  ratio: number;
  extractionSpeed: "fast" | "slow" | "optimal";
  recommendation: string;
}