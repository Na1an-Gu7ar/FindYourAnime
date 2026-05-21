const store = new Map();

export function getCached(key) {
  const item = store.get(key);

  if (!item) return null;
  if (item.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }

  return item.value;
}

export function setCached(key, value, ttlMs = 1000 * 60 * 10) {
  store.set(key, {
    expiresAt: Date.now() + ttlMs,
    value
  });
  return value;
}

export async function remember(key, resolver, ttlMs) {
  const cached = getCached(key);
  if (cached) return cached;

  const value = await resolver();
  return setCached(key, value, ttlMs);
}
