function encodeUserInfo(value: string): string {
  return encodeURIComponent(value);
}

/** Full `MONGODB_URI` or built from `MONGODB_USER`, `MONGODB_PASSWORD`, `MONGODB_HOST`. */
export function resolveMongoUri(): string | undefined {
  const direct = process.env.MONGODB_URI?.trim();
  if (direct) return direct;

  const user = process.env.MONGODB_USER?.trim();
  const password = process.env.MONGODB_PASSWORD?.trim();
  const host = process.env.MONGODB_HOST?.trim();
  if (!user || !password || !host) return undefined;

  return `mongodb+srv://${encodeUserInfo(user)}:${encodeUserInfo(password)}@${host}/?retryWrites=true&w=majority`;
}