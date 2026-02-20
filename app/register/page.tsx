"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/auth/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm space-y-6"
      >
        <h1 className="text-3xl font-light text-center">
          Create Account
        </h1>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-white"
        />

        <input
          type="password"
          placeholder="Password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-white"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black rounded-xl py-3 font-medium hover:bg-neutral-200 transition"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-sm text-neutral-400">
          Already have account?{" "}
          <a
            href="/login"
            className="underline"
          >
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}