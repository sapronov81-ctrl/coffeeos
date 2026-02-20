import { ShotInput, ShotAnalysis } from "@/types/calibration";

export function analyzeShot(input: ShotInput): ShotAnalysis {
  const ratio = input.yield / input.dose;

  let extractionSpeed: ShotAnalysis["extractionSpeed"] = "optimal";
  let recommendation = "Extraction looks good.";

  if (input.time < 22) {
    extractionSpeed = "fast";
    recommendation =
      "Shot is running too fast. Grind finer or increase dose.";
  }

  if (input.time > 32) {
    extractionSpeed = "slow";
    recommendation =
      "Shot is running too slow. Grind coarser or reduce dose.";
  }

  if (input.taste === "sour") {
    recommendation =
      "Sour taste detected. Try grinding finer or increasing extraction time.";
  }

  if (input.taste === "bitter") {
    recommendation =
      "Bitter taste detected. Try grinding coarser or reducing extraction time.";
  }

  return {
    ratio,
    extractionSpeed,
    recommendation,
  };
}