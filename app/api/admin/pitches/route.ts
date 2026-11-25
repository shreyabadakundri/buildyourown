import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { PitchStatus } from "@/types";
import { listPitches, toAdminRow, updatePitchStatus } from "@/lib/db/pitches";

function isAdmin() {
  return cookies().get("bwm_admin")?.value === "1";
}

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const docs = await listPitches();
    return NextResponse.json({ pitches: docs.map(toAdminRow) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "DB error";
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as { id?: string; status?: PitchStatus };
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  try {
    await updatePitchStatus(body.id, body.status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    const code = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ error: message }, { status: code });
  }
}