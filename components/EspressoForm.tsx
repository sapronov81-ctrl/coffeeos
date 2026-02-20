"use client";

import { useState } from "react";

interface Props {
  setResponse: (value: string | null) => void;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
}

export default function EspressoForm({
  setResponse,
  setLoading,
  setError,
}: Props) {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(
        `/api/espresso?message=${encodeURIComponent(message)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResponse(data.response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe your shot issue..."
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-600"
        rows={4}
        required
      />

      <button
        type="submit"
        className="w-full bg-white text-black py-3 rounded-xl text-sm font-medium active:scale-95 transition"
      >
        Calibrate
      </button>
    </form>
  );
}