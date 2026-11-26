function encodeUserInfo(value: string): string {
  return encodeURIComponent(value);
}

function stripQuotes(value: string): string {
  let t = value.trim();
  const smart = [
    ["\u201C", "\u201D"],
    ["\u2018", "\u2019"],
  ] as const;
  for (const [open, close] of smart) {
    if (t.startsWith(open) && t.endsWith(close)) {
      t = t.slice(1, -1).trim();
    }
  }
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1).trim();
  }
  return t;
}

function preprocessMongoRaw(raw: string): string {
  let uri = stripQuotes(raw).replace(/\r?\n/g, "").trim();
  uri = uri.replace(/^\uFEFF/, "");
  uri = uri.replace(/^MONGODB_URI\s*=\s*/i, "");
  const lower = uri.toLowerCase();
  if (lower.startsWith("mongodb+srv://")) {
    return `mongodb+srv://${uri.slice("mongodb+srv://".length)}`;
  }
  if (lower.startsWith("mongodb://")) {
    return `mongodb://${uri.slice("mongodb://".length)}`;
  }
  return uri;
}

export function isValidMongoScheme(uri: string): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

export type MongoUriIssue =
  | "empty"
  | "placeholder"
  | "missing_scheme"
  | "looks_like_db_name"
  | "unknown";

/** Safe hint for /api/health — never exposes the URI. */
export function diagnoseMongoUriIssue(raw: string | undefined): MongoUriIssue | null {
  if (!raw?.trim()) return null;
  const uri = preprocessMongoRaw(raw);
  if (!uri) return "empty";
  if (uri.includes("cluster0.xxxxx") || uri.includes("YOUR_")) return "placeholder";
  if (isValidMongoScheme(uri)) return null;
  if (!uri.includes("://") && uri.includes("mongodb.net")) return "missing_scheme";
  if (!uri.includes("://") && !uri.includes(".") && /^[a-z0-9_-]+$/i.test(uri)) {
    return "looks_like_db_name";
  }
  return "unknown";
}

/**
 * Fixes common paste mistakes (quotes, host-only, sample placeholders).
 */
export function normalizeMongoUri(raw: string): string | undefined {
  let uri = preprocessMongoRaw(raw);

  if (!uri || uri.includes("cluster0.xxxxx") || uri.includes("YOUR_")) {
    return undefined;
  }

  if (uri.includes("mongodb.net") && !uri.includes("://")) {
    uri = `mongodb+srv://${uri.replace(/^\/+/, "")}`;
  }

  if (!uri.includes("://") && !uri.includes(".") && uri.length < 3) {
    return undefined;
  }

  if (!isValidMongoScheme(uri)) {
    return undefined;
  }

  return uri;
}

/** Full `MONGODB_URI` or built from `MONGODB_USER`, `MONGODB_PASSWORD`, `MONGODB_HOST`. */
export function resolveMongoUri(): string | undefined {
  const direct = process.env.MONGODB_URI?.trim();
  if (direct) {
    const normalized = normalizeMongoUri(direct);
    if (normalized) return normalized;
    if (typeof window === "undefined") {
      console.warn(
        '[BuildWithMe] MONGODB_URI is set but invalid. It must start with "mongodb://" or "mongodb+srv://" — paste the full string from Atlas → Connect → Drivers.'
      );
    }
  }

  const user = process.env.MONGODB_USER?.trim();
  const password = stripQuotes(process.env.MONGODB_PASSWORD ?? "");
  let host = stripQuotes(process.env.MONGODB_HOST?.trim() ?? "");

  if (!user || !password || !host) return undefined;

  if (!host.includes("://") && host.includes("mongodb.net")) {
    host = host.replace(/^\/+/, "");
  } else if (host.startsWith("mongodb+srv://")) {
    const built = normalizeMongoUri(host);
    if (built) return built;
  } else if (!host.includes(".")) {
    return undefined;
  }

  return `mongodb+srv://${encodeUserInfo(user)}:${encodeUserInfo(password)}@${host.replace(/^mongodb\+srv:\/\//, "")}/?retryWrites=true&w=majority`;
}

const ISSUE_HINTS: Record<MongoUriIssue, string> = {
  empty: "MONGODB_URI is empty after trimming — paste the full connection string.",
  placeholder:
    "MONGODB_URI still contains the sample placeholder (cluster0.xxxxx) — replace with your real Atlas URI.",
  missing_scheme:
    "Paste the full driver string starting with mongodb+srv://, not the host name alone.",
  looks_like_db_name:
    "MONGODB_URI looks like a database name (buildyourown). Use the full mongodb+srv:// user:pass@host/… string instead.",
  unknown:
    "MONGODB_URI must start with mongodb+srv:// (Atlas → Connect → Drivers). Remove quotes and redeploy.",
};

export function mongoUriValidationHint(issue?: MongoUriIssue | null): string {
  if (issue && issue in ISSUE_HINTS) return ISSUE_HINTS[issue];
  return ISSUE_HINTS.unknown;
}