"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CoreScreen() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        setLoading(false);
        return;
      }

      router.push(
        `/app/${data.intent}?query=${encodeURIComponent(
          message
        )}`
      );
    } catch (error) {
      console.error("Intent request failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center px-6">
      <div className="max-w-xl mx-auto w-full">
        <h1 className="text-3xl font-light mb-8 text-center">
          What do you need?
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Describe your task..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-white"
          />
        </form>

        {loading && (
          <p className="text-center text-neutral-500 mt-4 text-sm">
            Analyzing...
          </p>
        )}
      </div>
    </div>
  );
}