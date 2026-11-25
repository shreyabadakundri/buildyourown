"use client";

import { useState } from "react";
import { Activity, ChevronRight } from "lucide-react";
import type { Telemetry } from "@/types";

interface TelemetryDrawerProps {
  telemetry: Telemetry;
  projectTitle: string;
}

export function TelemetryDrawer({ telemetry, projectTitle }: TelemetryDrawerProps) {
  const [open, setOpen] = useState(false);

  const rows: { label: string; value: string }[] = [
    { label: "validation_ms", value: `${telemetry.validation_ms} ms` },
    { label: "ai_inference_ms", value: `${telemetry.ai_inference_ms} ms` },
    { label: "db_write_ms", value: `${telemetry.db_write_ms} ms` },
    { label: "email_ms", value: `${telemetry.email_ms} ms` },
    { label: "tokens_estimated", value: String(telemetry.tokens_estimated) },
    { label: "cost_usd", value: `$${telemetry.cost_usd.toFixed(6)}` },
    {
      label: "zod_valid",
      value: telemetry.zod_valid ? "pass" : "fail",
    },
    {
      label: "rate_limit_ok",
      value: telemetry.rate_limit_ok ? "ok" : "limited",
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-xs text-emerald-400 shadow-lg hover:border-emerald-600"
      >
        <Activity className="h-4 w-4" />
        Live Telemetry
      </button>

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform border-l border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <h3 className="font-mono text-sm font-semibold text-zinc-100">
            Engineering Telemetry
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-zinc-400 hover:text-zinc-100"
            aria-label="Close telemetry"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <p className="px-4 pt-2 font-mono text-xs text-zinc-500 truncate">{projectTitle}</p>
        <ul className="mt-4 space-y-3 p-4 font-mono text-sm">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between border-b border-zinc-900 pb-2"
            >
              <span className="text-zinc-500">{row.label}</span>
              <span className="text-emerald-400">{row.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
          aria-label="Close overlay"
        />
      )}

    </>
  );
}