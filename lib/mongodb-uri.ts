function encodeUserInfo(value: string): string {
  return encodeURIComponent(value);
}

function stripQuotes(value: string): string {
  const t = value.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1).trim();
  }
  return t;
}

export function isValidMongoScheme(uri: string): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

/**
 * Fixes common paste mistakes (quotes, host-only, sample placeholders).
 */
export function normalizeMongoUri(raw: string): string | undefined {
  let uri = stripQuotes(raw);

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
    return undefined;
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

export function mongoUriValidationHint(): string {
  return 'MONGODB_URI must be the full Atlas string starting with mongodb+srv:// (from Atlas → Connect → Drivers). Remove quotes. Do not use placeholders like cluster0.xxxxx.';
}