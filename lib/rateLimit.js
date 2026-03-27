const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;
const store = new Map();

export function rateLimit(key) {
  const now = Date.now();
  const entry = store.get(key) || { count: 0, start: now };

  if (now - entry.start > WINDOW_MS) {
    store.set(key, { count: 1, start: now });
    return { ok: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - entry.start)) / 1000) };
  }

  entry.count += 1;
  store.set(key, entry);
  return { ok: true };
}
