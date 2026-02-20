"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/auth/auth-client";

interface Profile {
  id: string;
  name: string;
  is_active: boolean;
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function getAccessToken(): Promise<string | null> {
    const { data } = await supabaseClient.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function loadProfiles() {
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessToken();

      if (!token) {
        setError("Not authenticated");
        setProfiles([]);
        return;
      }

      const res = await fetch("/api/profiles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setProfiles([]);
        setError(err?.error || "Failed to load profiles");
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        setProfiles([]);
        return;
      }

      setProfiles(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  async function create() {
    if (!name.trim()) return;

    try {
      setError(null);

      const token = await getAccessToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setError(err?.error || "Profile creation failed");
        return;
      }

      setName("");
      await loadProfiles();
    } catch (err) {
      console.error(err);
      setError("Profile creation failed");
    }
  }

  async function activate(id: string) {
    try {
      const token = await getAccessToken();
      if (!token) return;

      await fetch(`/api/profiles/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await loadProfiles();
    } catch (err) {
      console.error(err);
    }
  }

  async function remove(id: string) {
    try {
      const token = await getAccessToken();
      if (!token) return;

      await fetch(`/api/profiles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await loadProfiles();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4">
      <h1 className="text-2xl font-semibold mb-6">
        Coffee Shop Profiles
      </h1>

      <div className="flex gap-2 mb-2">
        <input
          className="flex-1 p-3 rounded-xl bg-neutral-800 outline-none"
          placeholder="New cafe name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={create}
          className="px-4 py-3 rounded-xl bg-amber-600 active:scale-95 transition"
        >
          Add
        </button>
      </div>

      <p className="text-xs text-neutral-400 mb-6">
        Each additional cafe profile increases subscription cost by 15%.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-neutral-400 text-sm">
          Loading profiles...
        </div>
      )}

      <div className="space-y-3">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`p-4 rounded-2xl ${
              profile.is_active
                ? "bg-amber-700"
                : "bg-neutral-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {profile.name}
              </span>

              <div className="flex gap-2">
                {!profile.is_active && (
                  <button
                    onClick={() => activate(profile.id)}
                    className="text-xs px-3 py-1 bg-green-600 rounded-lg"
                  >
                    Activate
                  </button>
                )}

                <button
                  onClick={() => remove(profile.id)}
                  className="text-xs px-3 py-1 bg-red-600 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && profiles.length === 0 && !error && (
          <div className="text-neutral-500 text-sm">
            No cafe profiles yet.
          </div>
        )}
      </div>
    </div>
  );
}