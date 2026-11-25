import type { PitchStatus, Telemetry } from "@/types";

export interface AdminPitchSummary {
  id: string;
  created_at: string;
  founder_name: string;
  email: string;
  project_title: string;
  deal_model: string;
  status: PitchStatus;
  ai_evaluation: {
    overall_score: number;
    feasibility_score?: number;
    market_pain_score?: number;
    founder_fit_score?: number;
  };
  telemetry?: Partial<Telemetry>;
}

export interface DashboardStats {
  total: number;
  shortlisted: number;
  rejected: number;
  avgOverall: number;
  avgFeasibility: number;
  avgMarketPain: number;
  avgFounderFit: number;
  statusCounts: Record<PitchStatus, number>;
  scoreHistogram: { bucket: string; count: number }[];
  submissionsByDay: { date: string; count: number }[];
  dealModelCounts: { model: string; count: number }[];
  pipeline: {
    inProgress: number;
    conversionShortlistPct: number;
    health: "strong" | "steady" | "quiet";
    healthLabel: string;
  };
  telemetry: {
    avgAiMs: number;
    avgTotalMs: number;
    totalCostUsd: number;
    totalTokens: number;
  };
}

const STATUSES: PitchStatus[] = ["New", "Call Booked", "Building", "Archived"];

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function buildDashboardStats(pitches: AdminPitchSummary[]): DashboardStats {
  const statusCounts = Object.fromEntries(
    STATUSES.map((s) => [s, 0])
  ) as Record<PitchStatus, number>;

  const histogram = Array.from({ length: 10 }, (_, i) => ({
    bucket: String(i + 1),
    count: 0,
  }));

  const dealMap = new Map<string, number>();
  const dayMap = new Map<string, number>();

  let sumOverall = 0;
  let sumFeas = 0;
  let sumMarket = 0;
  let sumFounder = 0;
  let nScores = 0;
  let shortlisted = 0;
  let rejected = 0;

  let sumAiMs = 0;
  let sumTotalMs = 0;
  let nTelemetry = 0;
  let totalCostUsd = 0;
  let totalTokens = 0;

  for (const p of pitches) {
    const score = p.ai_evaluation?.overall_score;
    if (typeof score === "number") {
      nScores += 1;
      sumOverall += score;
      sumFeas += p.ai_evaluation.feasibility_score ?? score;
      sumMarket += p.ai_evaluation.market_pain_score ?? score;
      sumFounder += p.ai_evaluation.founder_fit_score ?? score;
      if (score >= 8) shortlisted += 1;
      else rejected += 1;
      const bucket = Math.min(10, Math.max(1, Math.round(score)));
      histogram[bucket - 1].count += 1;
    }

    const st = p.status ?? "New";
    if (statusCounts[st] !== undefined) statusCounts[st] += 1;
    else statusCounts.New += 1;

    dealMap.set(p.deal_model, (dealMap.get(p.deal_model) ?? 0) + 1);

    const dk = dayKey(p.created_at);
    dayMap.set(dk, (dayMap.get(dk) ?? 0) + 1);

    const t = p.telemetry;
    if (t?.ai_inference_ms != null) {
      nTelemetry += 1;
      sumAiMs += t.ai_inference_ms;
      const total =
        (t.validation_ms ?? 0) +
        (t.ai_inference_ms ?? 0) +
        (t.db_write_ms ?? 0) +
        (t.email_ms ?? 0);
      sumTotalMs += total;
      totalCostUsd += t.cost_usd ?? 0;
      totalTokens += t.tokens_estimated ?? 0;
    }
  }

  const sortedDays = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  const last14 = sortedDays.slice(-14);

  const inProgress =
    statusCounts["Call Booked"] + statusCounts.Building;
  const conversionShortlistPct =
    pitches.length > 0 ? round1((shortlisted / pitches.length) * 100) : 0;

  let health: DashboardStats["pipeline"]["health"] = "quiet";
  let healthLabel = "No data yet — submit a demo pitch to populate.";
  if (pitches.length > 0) {
    const avg = nScores > 0 ? sumOverall / nScores : 0;
    if (avg >= 7.5 && shortlisted >= 1) {
      health = "strong";
      healthLabel = "Strong pipeline: healthy scores and shortlisted founders.";
    } else if (avg >= 5.5 || inProgress > 0) {
      health = "steady";
      healthLabel = "Steady flow: nurture new leads and book calls.";
    } else {
      health = "quiet";
      healthLabel = "Early stage: focus on intake volume and founder fit.";
    }
  }

  return {
    total: pitches.length,
    shortlisted,
    rejected,
    avgOverall: nScores ? round1(sumOverall / nScores) : 0,
    avgFeasibility: nScores ? round1(sumFeas / nScores) : 0,
    avgMarketPain: nScores ? round1(sumMarket / nScores) : 0,
    avgFounderFit: nScores ? round1(sumFounder / nScores) : 0,
    statusCounts,
    scoreHistogram: histogram,
    submissionsByDay: last14.map(([date, count]) => ({ date, count })),
    dealModelCounts: [...dealMap.entries()].map(([model, count]) => ({
      model,
      count,
    })),
    pipeline: {
      inProgress,
      conversionShortlistPct,
      health,
      healthLabel,
    },
    telemetry: {
      avgAiMs: nTelemetry ? Math.round(sumAiMs / nTelemetry) : 0,
      avgTotalMs: nTelemetry ? Math.round(sumTotalMs / nTelemetry) : 0,
      totalCostUsd: round1(totalCostUsd),
      totalTokens: Math.round(totalTokens),
    },
  };
}