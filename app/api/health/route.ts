import { NextResponse } from "next/server";
import {
  getCohereApiKey,
  getMongoDbName,
  getMongoUri,
  isAdminConfigured,
} from "@/lib/env";

export const dynamic = "force-dynamic";

/** Safe config check for Vercel — no secret values exposed. */
export async function GET() {
  const cohere = Boolean(getCohereApiKey());
  const mongo = Boolean(getMongoUri());
  const dbName = getMongoDbName();

  const admin = isAdminConfigured();
  const ok = cohere && mongo && admin;

  const hints: string[] = [];
  if (!cohere) hints.push("Add COHERE_API_KEY");
  if (!mongo) hints.push("Add MONGODB_URI and MONGODB_DB_NAME=buildyourown, USE_LOCAL_DB=0");
  if (!admin) hints.push("Add ADMIN_USERNAME and ADMIN_PASSWORD (e.g. admin / your password)");

  return NextResponse.json(
    {
      status: ok ? "ready" : "misconfigured",
      checks: {
        COHERE_API_KEY: cohere ? "set" : "missing",
        MONGODB_URI: mongo ? "set" : "missing",
        MONGODB_DB_NAME: dbName,
        ADMIN_PASSWORD: admin ? "set" : "missing",
      },
      vercel: {
        hint:
          hints.length > 0
            ? `${hints.join("; ")} → Vercel Environment Variables (Production) → Redeploy`
            : "All required keys present",
      },
    },
    { status: ok ? 200 : 503 }
  );
}