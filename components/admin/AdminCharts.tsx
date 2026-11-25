"use client";

import type { DashboardStats } from "@/lib/admin-analytics";
import type { PitchStatus } from "@/types";

const STATUS_COLORS: Record<PitchStatus, string> = {
  New: "#34d399",
  "Call Booked": "#22d3ee",
  Building: "#a78bfa",
  Archived: "#71717a",
};

export function StatCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Total pitches", value: String(stats.total), sub: "All time" },
    {
      label: "Shortlisted (8+)",
      value: String(stats.shortlisted),
      sub: `${stats.pipeline.conversionShortlistPct}% of intake`,
    },
    {
      label: "Avg overall score",
      value: stats.avgOverall.toFixed(1),
      sub: "AI composite",
    },
    {
      label: "In pipeline",
      value: String(stats.pipeline.inProgress),
      sub: "Call booked + building",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-zinc-500">
            {c.label}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-50">
            {c.value}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

export function PipelineHealthBanner({ stats }: { stats: DashboardStats }) {
  const border =
    stats.pipeline.health === "strong"
      ? "border-emerald-600/50 bg-emerald-950/25"
      : stats.pipeline.health === "steady"
        ? "border-cyan-700/50 bg-cyan-950/20"
        : "border-zinc-700 bg-zinc-900/40";

  return (
    <div className={`rounded-xl border p-4 ${border}`}>
      <p className="font-mono text-xs uppercase text-emerald-500">
        Pipeline health
      </p>
      <p className="mt-2 text-sm text-zinc-200">{stats.pipeline.healthLabel}</p>
      <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
        <div>
          <span className="text-zinc-500">Feasibility avg</span>
          <p className="font-mono text-lg text-zinc-100">
            {stats.avgFeasibility.toFixed(1)}
          </p>
        </div>
        <div>
          <span className="text-zinc-500">Market pain avg</span>
          <p className="font-mono text-lg text-zinc-100">
            {stats.avgMarketPain.toFixed(1)}
          </p>
        </div>
        <div>
          <span className="text-zinc-500">Founder fit avg</span>
          <p className="font-mono text-lg text-zinc-100">
            {stats.avgFounderFit.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ScoreHistogram({ stats }: { stats: DashboardStats }) {
  const max = Math.max(1, ...stats.scoreHistogram.map((h) => h.count));

  return (
    <ChartPanel title="Score distribution (1–10)">
      <div className="flex h-40 items-end justify-between gap-1 pt-2">
        {stats.scoreHistogram.map((h) => (
          <div key={h.bucket} className="flex flex-1 flex-col items-center gap-1">
            <span className="font-mono text-[10px] text-zinc-500">{h.count || ""}</span>
            <div
              className="w-full max-w-[2.5rem] rounded-t bg-emerald-500/90 transition-all"
              style={{ height: `${(h.count / max) * 100}%`, minHeight: h.count ? 4 : 0 }}
              title={`Score ${h.bucket}: ${h.count}`}
            />
            <span className="font-mono text-[10px] text-zinc-600">{h.bucket}</span>
          </div>
        ))}
      </div>
    </ChartPanel>
  );
}

export function StatusBreakdown({ stats }: { stats: DashboardStats }) {
  const entries = (
    Object.entries(stats.statusCounts) as [PitchStatus, number][]
  ).filter(([, n]) => n > 0 || stats.total === 0);
  const max = Math.max(1, ...entries.map(([, n]) => n));

  return (
    <ChartPanel title="Status breakdown">
      <ul className="space-y-3">
        {(Object.keys(stats.statusCounts) as PitchStatus[]).map((status) => {
          const count = stats.statusCounts[status];
          const pct = stats.total ? (count / stats.total) * 100 : 0;
          return (
            <li key={status}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-zinc-400">{status}</span>
                <span className="font-mono text-zinc-300">
                  {count} ({pct.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(count / max) * 100}%`,
                    backgroundColor: STATUS_COLORS[status],
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </ChartPanel>
  );
}

export function SubmissionsTimeline({ stats }: { stats: DashboardStats }) {
  const data = stats.submissionsByDay;
  const max = Math.max(1, ...data.map((d) => d.count));

  if (data.length === 0) {
    return (
      <ChartPanel title="Submissions (last 14 days)">
        <p className="text-sm text-zinc-500">No submissions yet.</p>
      </ChartPanel>
    );
  }

  return (
    <ChartPanel title="Submissions (last 14 days)">
      <svg className="h-36 w-full" viewBox={`0 0 ${Math.max(data.length * 40, 200)} 120`}>
        {data.map((d, i) => {
          const barH = (d.count / max) * 90;
          const x = i * 40 + 8;
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={100 - barH}
                width={28}
                height={barH}
                rx={4}
                fill="#10b981"
                opacity={0.85}
              />
              <text
                x={x + 14}
                y={112}
                textAnchor="middle"
                fill="#71717a"
                fontSize={8}
                fontFamily="monospace"
              >
                {d.date.slice(5)}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartPanel>
  );
}

export function DealModelChart({ stats }: { stats: DashboardStats }) {
  const total = stats.dealModelCounts.reduce((a, b) => a + b.count, 0) || 1;

  return (
    <ChartPanel title="Deal model mix">
      {stats.dealModelCounts.length === 0 ? (
        <p className="text-sm text-zinc-500">No data</p>
      ) : (
        <ul className="space-y-2">
          {stats.dealModelCounts.map((d) => (
            <li key={d.model} className="text-sm">
              <div className="flex justify-between gap-2">
                <span className="truncate text-zinc-400">{d.model}</span>
                <span className="shrink-0 font-mono text-emerald-400">
                  {d.count} ({((d.count / total) * 100).toFixed(0)}%)
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartPanel>
  );
}

export function TelemetryPanel({ stats }: { stats: DashboardStats }) {
  return (
    <ChartPanel title="Engineering telemetry (aggregate)">
      <dl className="grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-4">
        <TelemetryStat label="Avg AI latency" value={`${stats.telemetry.avgAiMs} ms`} />
        <TelemetryStat label="Avg request" value={`${stats.telemetry.avgTotalMs} ms`} />
        <TelemetryStat label="Est. API cost" value={`$${stats.telemetry.totalCostUsd}`} />
        <TelemetryStat label="Est. tokens" value={String(stats.telemetry.totalTokens)} />
      </dl>
    </ChartPanel>
  );
}

function ChartPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h3 className="font-mono text-xs uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function TelemetryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm text-emerald-400">{value}</dd>
    </div>
  );
}