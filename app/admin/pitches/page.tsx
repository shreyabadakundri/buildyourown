"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPitchTable } from "@/components/admin/AdminPitchTable";
import { useAdminPitches } from "@/components/admin/useAdminPitches";

export default function AdminPitchesPage() {
  const { pitches, loading, loadPitches, updateStatus } = useAdminPitches();

  if (loading && pitches.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-500">
        Loading pitches…
      </div>
    );
  }

  return (
    <AdminLayout
      title="All pitches"
      subtitle="Search, filter, and update founder pipeline status"
      onRefresh={() => void loadPitches()}
      refreshing={loading}
    >
      <div className="mx-auto max-w-6xl">
        <AdminPitchTable
          pitches={pitches}
          loading={loading}
          onStatusChange={updateStatus}
        />
      </div>
    </AdminLayout>
  );
}