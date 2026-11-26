import { resolveMongoUri } from "@/lib/mongodb-uri";

function warnMissing(key: string, hint: string): undefined {
  if (typeof window === "undefined") {
    console.warn(`[BuildWithMe] Missing ${key} — ${hint}`);
  }
  return undefined;
}

export function getMongoUri(): string | undefined {
  const v = resolveMongoUri();
  if (!v) {
    warnMissing(
      "MONGODB_URI",
      "set MONGODB_URI or MONGODB_USER + MONGODB_PASSWORD + MONGODB_HOST (or use local file store in dev)"
    );
  }
  return v;
}

export function getMongoDbName(): string {
  return process.env.MONGODB_DB_NAME ?? "buildyourown";
}

export function useLocalPitchStore(): boolean {
  if (getMongoUri()) return false;
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.USE_LOCAL_DB === "0") return false;
  return process.env.USE_LOCAL_DB === "1" || process.env.NODE_ENV === "development";
}

export function getGeminiApiKey(): string | undefined {
  const v = process.env.GEMINI_API_KEY;
  if (!v) warnMissing("GEMINI_API_KEY", "legacy Gemini path disabled");
  return v;
}

export function getCohereApiKey(): string | undefined {
  const v = process.env.COHERE_API_KEY?.trim();
  if (!v) {
    warnMissing(
      "COHERE_API_KEY",
      "add to .env.local (local) or Vercel → Settings → Environment Variables (deployed), then restart/redeploy"
    );
    return undefined;
  }
  return v;
}

export function getResendApiKey(): string | undefined {
  const v = process.env.RESEND_API_KEY;
  if (!v) warnMissing("RESEND_API_KEY", "emails will be skipped");
  return v;
}

export function getAdminEmail(): string | undefined {
  return process.env.ADMIN_EMAIL;
}

export function getAdminUsername(): string {
  const v = process.env.ADMIN_USERNAME;
  if (v) return v;
  if (process.env.NODE_ENV === "development") return "admin";
  warnMissing("ADMIN_USERNAME", "defaulting login to disabled until set");
  return "admin";
}

export function getAdminPassword(): string | undefined {
  const v = process.env.ADMIN_PASSWORD;
  if (v) return v;
  if (process.env.NODE_ENV === "development") return "admin";
  warnMissing("ADMIN_PASSWORD", "admin dashboard locked");
  return undefined;
}

export function getCalcomLink(): string {
  return process.env.CALCOM_LINK ?? "https://cal.com";
}