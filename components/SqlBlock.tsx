"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function SqlBlock({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative rounded-lg border border-zinc-800 bg-zinc-950">
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-xs text-zinc-300 hover:border-emerald-600"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
        Copy SQL
      </button>
      <pre className="overflow-x-auto p-4 pt-12 font-mono text-xs leading-relaxed text-emerald-200/90">
        {sql}
      </pre>
    </div>
  );
}