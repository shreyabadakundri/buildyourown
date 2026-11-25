import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const authed = cookies().get("bwm_admin")?.value === "1";
  if (!authed) {
    return NextResponse.json({ authed: false }, { status: 401 });
  }
  return NextResponse.json({ authed: true });
}