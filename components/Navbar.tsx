"use client";

import { Sparkles, Hammer } from "lucide-react";
import { useState } from "react";
import { ReversePitchModal } from "@/components/ReversePitchModal";

interface NavbarProps {
  onDemoMode?: () => void;
}

export function Navbar({ onDemoMode }: NavbarProps) {
  const [reverseOpen, setReverseOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <a href="/" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-emerald-400">
            <Hammer className="h-5 w-5" />
            BuildWithMe.dev
          </a>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onDemoMode}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-emerald-600/50 hover:text-emerald-300 sm:text-sm"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              1-Click Demo Mode
            </button>
            <button
              type="button"
              onClick={() => setReverseOpen(true)}
              className="rounded-md bg-emerald-500 px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400 sm:text-sm"
            >
              Hiring? Test My Engineering
            </button>
            <a
              href="/admin/login"
              className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-mono text-zinc-400 transition hover:border-emerald-600 hover:text-emerald-400 sm:text-sm"
            >
              Admin
            </a>
          </div>
        </div>
      </header>
      <ReversePitchModal open={reverseOpen} onClose={() => setReverseOpen(false)} />
    </>
  );
}