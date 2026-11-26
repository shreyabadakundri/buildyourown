"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    void fetch("/api/admin/session")
      .then((r) => {
        if (r.ok) router.replace("/admin/dashboard");
      })
      .finally(() => setChecking(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(
        res.status === 503
          ? data.error ??
              "Server admin not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD on Vercel, then Redeploy."
          : data.error ?? "Invalid username or password"
      );
      return;
    }
    router.replace("/admin/dashboard");
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-500">
        Checking session…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-emerald-500">
          BuildWithMe Studio
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-50">Admin sign in</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Sign in to open the dashboard and pitch list. Default dev credentials are
          pre-filled below.
        </p>

        <label className="mt-6 block">
          <span className="font-mono text-xs text-zinc-500">Username</span>
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </label>

        <label className="mt-4 block">
          <span className="font-mono text-xs text-zinc-500">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
        >
          Sign in
        </button>

        <p className="mt-6 text-center text-xs text-zinc-600">
          After login:{" "}
          <span className="text-zinc-400">/admin/dashboard</span>
          {" · "}
          <span className="text-zinc-400">/admin/pitches</span>
        </p>
      </form>

      <Link href="/" className="mt-6 text-sm text-zinc-500 hover:text-emerald-400">
        ← Back to home
      </Link>
    </div>
  );
}