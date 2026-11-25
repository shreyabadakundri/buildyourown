"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminPitchSummary } from "@/lib/admin-analytics";
import type { PitchStatus } from "@/types";

export function useAdminPitches() {
  const router = useRouter();
  const [pitches, setPitches] = useState<AdminPitchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const loadPitches = useCallback(async () => {
    setLoading(true);
    try {
      const session = await fetch("/api/admin/session");
      if (!session.ok) {
        setAuthed(false);
        setPitches([]);
        return false;
      }
      setAuthed(true);

      const res = await fetch("/api/admin/pitches");
      if (res.status === 401) {
        setAuthed(false);
        return false;
      }
      const data = await res.json();
      if (res.ok) {
        setPitches((data.pitches ?? []) as AdminPitchSummary[]);
      }
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPitches().then((ok) => {
      if (ok === false) router.replace("/admin/login");
    });
  }, [loadPitches, router]);

  async function updateStatus(id: string, status: PitchStatus) {
    await fetch("/api/admin/pitches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setPitches((rows) =>
      rows.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  return { pitches, loading, authed, loadPitches, updateStatus };
}