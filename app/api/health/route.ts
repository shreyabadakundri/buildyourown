import { NextResponse } from "next/server";
import { getCohereApiKey, getMongoDbName, getMongoUri } from "@/lib/env";

export const dynamic = "force-dynamic";

/** Safe config check for Vercel — no secret values exposed. */
export async function GET() {
  const cohere = Boolean(getCohereApiKey());
  const mongo = Boolean(getMongoUri());
  const dbName = getMongoDbName();

  const ok = cohere && mongo;

  return NextResponse.json(
    {
      status: ok ? "ready" : "misconfigured",
      checks: {
        COHERE_API_KEY: cohere ? "set" : "missing",
        MONGODB_URI: mongo ? "set" : "missing",
        MONGODB_DB_NAME: dbName,
      },
      vercel: {
        hint: !cohere
          ? "Vercel → Project → Settings → Environment Variables → add COHERE_API_KEY → Redeploy"
          : !mongo
            ? "Add MONGODB_URI (and set USE_LOCAL_DB=0). Atlas Network Access: 0.0.0.0/0"
            : "All required keys present",
      },
    },
    { status: ok ? 200 : 503 }
  );
}