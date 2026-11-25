"use client";

import { useState } from "react";
import { X, Loader2, Calendar } from "lucide-react";
import type { ReversePitchResult } from "@/types";
import { reversePitchFormSchema } from "@/types";

interface ReversePitchModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReversePitchModal({ open, onClose }: ReversePitchModalProps) {
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [challenge, setChallenge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReversePitchResult | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = reversePitchFormSchema.safeParse({
      company_name: company,
      product_url_or_description: product,
      feature_challenge: challenge,
    });
    if (!parsed.success) {
      setError("Please fill all fields with enough detail.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/reverse-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Request failed");
        return;
      }
      setResult(data.result);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none";

  const calHref = process.env.NEXT_PUBLIC_CALCOM_LINK || "https://cal.com";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="pr-8 font-mono text-lg font-semibold text-emerald-400">
          Reverse Pitch — 7-Day Ship Plan
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Tell me your product and hardest feature. I&apos;ll architect how I&apos;d ship it in a week.
        </p>

        {!result ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              className={inputClass}
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Product URL or description"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Feature challenge to build or scale"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Generate Engineering Proposal
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-4 text-sm">
            <Section title="Architecture summary" body={result.architecture_summary} />
            <Section title="Recommended stack" body={result.recommended_stack} />
            <ListSection title="Trade-offs" items={result.stack_tradeoffs} />
            <ListSection title="Edge cases & security" items={result.edge_cases_security} />
            <SevenDayPlan plan={result.seven_day_plan} />
            <a
              href={calHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md bg-emerald-500 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              <Calendar className="h-4 w-4" />
              Impressed? Book a 15-Min Interview
            </a>
            {!process.env.NEXT_PUBLIC_CALCOM_LINK && (
              <p className="text-center text-xs text-zinc-500">
                Set NEXT_PUBLIC_CALCOM_LINK in env for your booking URL
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <h4 className="font-mono text-xs uppercase text-emerald-500">{title}</h4>
      <p className="mt-2 text-zinc-300">{body}</p>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <h4 className="font-mono text-xs uppercase text-emerald-500">{title}</h4>
      <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function SevenDayPlan({
  plan,
}: {
  plan: ReversePitchResult["seven_day_plan"];
}) {
  const days = Object.entries(plan) as [string, string][];
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <h4 className="font-mono text-xs uppercase text-emerald-500">7-day execution plan</h4>
      <ul className="mt-2 space-y-2">
        {days.map(([day, task]) => (
          <li key={day} className="text-zinc-300">
            <span className="font-mono text-emerald-400">{day.replace("_", " ")}:</span> {task}
          </li>
        ))}
      </ul>
    </div>
  );
}