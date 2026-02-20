"use client";

import { useState } from "react";

export default function AuditScreen({
  profile,
}: {
  profile: any;
}) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  async function runAudit() {
    const token = localStorage.getItem("access_token");

    const res = await fetch("/api/audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        input,
        profileId: profile?.id,
      }),
    });

    const data = await res.json();
    setResult(data.result);
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-semibold mb-4">
        Audit
      </h2>

      <textarea
        className="w-full p-3 rounded-xl bg-neutral-800 mb-4"
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe current espresso workflow..."
      />

      <button
        onClick={runAudit}
        className="px-4 py-3 rounded-xl bg-amber-600"
      >
        Run Audit
      </button>

      {result && (
        <div className="mt-6 p-4 bg-neutral-800 rounded-xl whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}