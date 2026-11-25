"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AdminPitchSummary } from "@/lib/admin-analytics";
import type { PitchStatus } from "@/types";

type Filter = "all" | "shortlisted" | "rejected";

const STATUSES: PitchStatus[] = ["New", "Call Booked", "Building", "Archived"];

interface AdminPitchTableProps {
  pitches: AdminPitchSummary[];
  loading: boolean;
  onStatusChange: (id: string, status: PitchStatus) => void;
}

export function AdminPitchTable({
  pitches,
  loading,
  onStatusChange,
}: AdminPitchTableProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PitchStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pitches.filter((p) => {
      const score = p.ai_evaluation?.overall_score ?? 0;
      if (filter === "shortlisted" && score < 8) return false;
      if (filter === "rejected" && score >= 8) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.project_title.toLowerCase().includes(q) ||
        p.founder_name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    });
  }, [pitches, filter, search, statusFilter]);

  return (
    <div>
      <PitchToolbar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        count={filtered.length}
        total={pitches.length}
      />

      {loading ? (
        <p className="text-sm text-zinc-500">Loading pitches…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/50 font-mono text-xs text-zinc-500">
              <tr>
                <th className="p-3">Submitted</th>
                <th className="p-3">Project</th>
                <th className="p-3">Founder</th>
                <th className="p-3">Deal</th>
                <th className="p-3">Scores</th>
                <th className="p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-zinc-900 hover:bg-zinc-900/30">
                  <td className="p-3 font-mono text-xs text-zinc-500">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-medium text-zinc-200">{p.project_title}</td>
                  <td className="p-3 text-zinc-400">
                    {p.founder_name}
                    <br />
                    <span className="text-xs">{p.email}</span>
                  </td>
                  <td className="max-w-[8rem] truncate p-3 text-xs text-zinc-500">
                    {p.deal_model}
                  </td>
                  <td className="p-3 font-mono text-xs">
                    <span className="text-emerald-400">
                      {p.ai_evaluation?.overall_score ?? "—"}
                    </span>
                    <span className="text-zinc-600">
                      {" "}
                      / F{p.ai_evaluation?.feasibility_score ?? "—"} M
                      {p.ai_evaluation?.market_pain_score ?? "—"}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={p.status}
                      onChange={(e) =>
                        onStatusChange(p.id, e.target.value as PitchStatus)
                      }
                      className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/pitch/${p.id}`}
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-6 text-center text-sm text-zinc-500">
              No pitches match your filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function PitchToolbar(props: {
  search: string;
  setSearch: (v: string) => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
  statusFilter: PitchStatus | "all";
  setStatusFilter: (s: PitchStatus | "all") => void;
  count: number;
  total: number;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <input
        type="search"
        placeholder="Search project, founder, email…"
        value={props.search}
        onChange={(e) => props.setSearch(e.target.value)}
        className="w-full max-w-md rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
      />
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "All scores"],
            ["shortlisted", "8+"],
            ["rejected", "<8"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => props.setFilter(key)}
            className={`rounded-md px-2.5 py-1 font-mono text-xs ${
              props.filter === key
                ? "bg-emerald-500 text-zinc-950"
                : "border border-zinc-700 text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
        <select
          value={props.statusFilter}
          onChange={(e) =>
            props.setStatusFilter(e.target.value as PitchStatus | "all")
          }
          className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-xs text-zinc-300"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <p className="font-mono text-xs text-zinc-500">
        Showing {props.count} of {props.total}
      </p>
    </div>
  );
}