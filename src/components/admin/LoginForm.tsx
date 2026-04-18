"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500 mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-brand-600 transition-colors placeholder:text-neutral-400"
          placeholder="you@far.ng"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500 mb-2">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-brand-600 transition-colors placeholder:text-neutral-400"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-gradient rounded px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
