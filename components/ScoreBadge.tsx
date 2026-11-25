export function ScoreBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const pct = Math.min(100, Math.max(0, score * 10));
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-xs">
        <span className="text-zinc-500">{label}</span>
        <span className="text-zinc-300">{score}/10</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function OverallBadge({ score }: { score: number }) {
  const tier =
    score >= 8 ? "Shortlisted" : score >= 6 ? "Promising" : "Needs work";
  const color =
    score >= 8
      ? "border-emerald-500 text-emerald-400 bg-emerald-950/40"
      : score >= 6
        ? "border-amber-600 text-amber-400 bg-amber-950/30"
        : "border-zinc-600 text-zinc-400 bg-zinc-900";

  return (
    <div
      className={`inline-flex flex-col items-center rounded-xl border px-6 py-4 ${color}`}
    >
      <span className="font-mono text-xs uppercase tracking-widest">{tier}</span>
      <span className="text-4xl font-bold tabular-nums">{score}</span>
      <span className="font-mono text-xs text-zinc-500">overall / 10</span>
    </div>
  );
}