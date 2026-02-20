"use client";

import { useEffect, useState } from "react";

interface Profile {
  id: string;
  name: string;
  is_active: boolean;
}

export default function SettingsScreen({
  profile,
}: {
  profile: any;
}) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/profiles");

      if (!res.ok) {
        setError("Unauthorized");
        return;
      }

      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      setError("Failed to load profiles");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!name.trim()) return;

    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setError(err?.error || "Failed to create profile");
        return;
      }

      setName("");
      load();
    } catch {
      setError("Failed to create profile");
    }
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-semibold mb-4">
        Settings
      </h2>

      <div className="mb-6">
        <p className="text-neutral-400">
          Active profile: {profile?.name || "None"}
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-3 rounded-xl bg-neutral-800"
          placeholder="New cafe name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={create}
          className="px-4 py-3 rounded-xl bg-amber-600"
        >
          Add
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-xl bg-neutral-800"
          >
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}