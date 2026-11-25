import { NextResponse } from "next/server";
import { getAdminPassword, getAdminUsername } from "@/lib/env";
import { safeEqual } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const adminPassword = getAdminPassword();
  const adminUsername = getAdminUsername();
  if (!adminPassword) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const username = body.username ?? "";
  const password = body.password ?? "";

  if (!safeEqual(username, adminUsername) || !safeEqual(password, adminPassword)) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("bwm_admin", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}