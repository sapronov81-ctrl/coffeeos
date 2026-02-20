"use client";

import { useState } from "react";
import { analyzeShot } from "@/lib/calibration/analyze-shot";
import { ShotAnalysis } from "@/types/calibration";

type ExtractionStatus = "under" | "ideal" | "over";

function getExtractionStatus(
  time: number,
  taste: "sour" | "bitter" | "balanced"
): ExtractionStatus {
  if (time < 22 || taste === "sour") return "under";
  if (time > 32 || taste === "bitter") return "over";
  return "ideal";
}

export default function CalibrationPage() {
  const [dose, setDose] = useState<number>(18);
  const [yieldAmount, setYieldAmount] = useState<number>(36);
  const [time, setTime] = useState<number>(28);
  const [taste, setTaste] =
    useState<"sour" | "bitter" | "balanced">("balanced");

  const [result, setResult] = useState<ShotAnalysis | null>(null);
  const [status, setStatus] =
    useState<ExtractionStatus | null>(null);

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();

    if (!dose || !yieldAmount || !time) return;

    const analysis = analyzeShot({
      dose,
      yield: yieldAmount,
      time,
      taste,
    });

    setResult(analysis);
    setStatus(getExtractionStatus(time, taste));
  }

  const ratio =
    dose > 0 ? (yieldAmount / dose).toFixed(2) : "0";

  const statusColor =
    status === "under"
      ? "text-blue-400"
      : status === "over"
      ? "text-red-400"
      : "text-green-400";

  const statusLabel =
    status === "under"
      ? "Under Extraction"
      : status === "over"
      ? "Over Extraction"
      : "Ideal Extraction";

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-xl mx-auto space-y-10">

        <h1 className="text-3xl font-light text-center tracking-wide">
          Shot Calibration
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleAnalyze}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm mb-2">
              Dose (g)
            </label>
            <input
              type="number"
              value={dose}
              min={0}
              step="0.1"
              onChange={(e) =>
                setDose(Number(e.target.value))
              }
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Yield (g)
            </label>
            <input
              type="number"
              value={yieldAmount}
              min={0}
              step="0.1"
              onChange={(e) =>
                setYieldAmount(Number(e.target.value))
              }
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Time (seconds)
            </label>
            <input
              type="number"
              value={time}
              min={0}
              step="1"
              onChange={(e) =>
                setTime(Number(e.target.value))
              }
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Taste
            </label>
            <select
              value={taste}
              onChange={(e) =>
                setTaste(
                  e.target.value as
                    | "sour"
                    | "bitter"
                    | "balanced"
                )
              }
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3"
            >
              <option value="balanced">Balanced</option>
              <option value="sour">Sour</option>
              <option value="bitter">Bitter</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black rounded-xl py-3 font-medium hover:opacity-90 transition"
          >
            Analyze Shot
          </button>
        </form>

        {/* RESULT */}
        {result && (
          <div className="bg-neutral-900 rounded-2xl p-6 space-y-6 border border-neutral-800">

            <div className="flex justify-between text-sm text-neutral-400">
              <span>Brew Ratio</span>
              <span>1:{ratio}</span>
            </div>

            <div className="flex justify-between text-sm text-neutral-400">
              <span>Extraction Speed</span>
              <span>{result.extractionSpeed}</span>
            </div>

            <div className={`text-center text-lg font-light ${statusColor}`}>
              {statusLabel}
            </div>

            <div className="text-neutral-300 pt-4 border-t border-neutral-800">
              {result.recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}