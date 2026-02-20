"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/auth/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      const accessToken = data.session.access_token;

      // сохраняем токен для client-side API
      localStorage.setItem("access_token", accessToken);

      // просим сервер установить httpOnly cookie
      await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-6"
      >
        <h1 className="text-3xl font-light text-center">
          CoffeeOS
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
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-neutral-400">
          No account?{" "}
          <a href="/register" className="underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}