import { NextResponse } from "next/server";
import {
  getCohereApiKey,
  getMongoDbName,
  getMongoUri,
  getMongoUriStatus,
  isAdminConfigured,
} from "@/lib/env";
import { mongoUriValidationHint } from "@/lib/mongodb-uri";
import { pingMongo } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/** Safe config check for Vercel — no secret values exposed. */
export async function GET() {
  const cohere = Boolean(getCohereApiKey());
  const mongoStatus = getMongoUriStatus();
  const mongo = Boolean(getMongoUri());
  const dbName = getMongoDbName();

  let mongoReachable: "ok" | "failed" | "skipped" = mongo ? "failed" : "skipped";
  if (mongo) {
    try {
      mongoReachable = (await pingMongo()) ? "ok" : "failed";
    } catch {
      mongoReachable = "failed";
    }
  }

  const admin = isAdminConfigured();
  const ok = cohere && mongo && admin && mongoReachable !== "failed";

  const hints: string[] = [];
  if (!cohere) hints.push("Add COHERE_API_KEY");
  if (!mongo) {
    hints.push(
      mongoStatus === "invalid"
        ? mongoUriValidationHint()
        : "Add MONGODB_URI and MONGODB_DB_NAME=buildyourown, USE_LOCAL_DB=0"
    );
  }
  if (!admin) hints.push("Add ADMIN_USERNAME and ADMIN_PASSWORD (e.g. admin / your password)");
  if (mongo && mongoReachable === "failed") {
    hints.push(
      "MongoDB URI is set but connection failed — check password, Atlas Network Access (0.0.0.0/0), and MONGODB_DB_NAME"
    );
  }

  return NextResponse.json(
    {
      status: ok ? "ready" : "misconfigured",
      checks: {
        COHERE_API_KEY: cohere ? "set" : "missing",
        MONGODB_URI: mongo ? "set" : mongoStatus,
        MONGODB_PING: mongoReachable,
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