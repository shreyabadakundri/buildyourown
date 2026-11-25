"use client";

import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { buildDashboardStats } from "@/lib/admin-analytics";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminPitches } from "@/components/admin/useAdminPitches";
import {
  DealModelChart,
  PipelineHealthBanner,
  ScoreHistogram,
  StatCards,
  StatusBreakdown,
  SubmissionsTimeline,
  TelemetryPanel,
} from "@/components/admin/AdminCharts";

export default function AdminDashboardPage() {
  const { pitches, loading, loadPitches } = useAdminPitches();
  const stats = useMemo(() => buildDashboardStats(pitches), [pitches]);

  if (loading && pitches.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-500">
        Loading dashboard…
      </div>
    );
  }

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Pipeline health, scores, and engineering telemetry"
      onRefresh={() => void loadPitches()}
      refreshing={loading}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <StatCards stats={stats} />
        <PipelineHealthBanner stats={stats} />
        <div className="grid gap-6 lg:grid-cols-2">
          <ScoreHistogram stats={stats} />
          <StatusBreakdown stats={stats} />
          <SubmissionsTimeline stats={stats} />
          <DealModelChart stats={stats} />
        </div>
        <TelemetryPanel stats={stats} />
        <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-center">
          <BarChart3 className="mx-auto h-6 w-6 text-zinc-600" />
          <p className="mt-2 text-sm text-zinc-500">
            Manage individual pitches on the{" "}
            <Link href="/admin/pitches" className="text-emerald-400 underline">
              All pitches
            </Link>{" "}
            page.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}