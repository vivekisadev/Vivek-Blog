// import { cache } from 'react'

const cache = new Map<string, any>();

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 
): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, {
    data,
    timestamp: now
  });

  return data;
}

export function clearCache(key: string) {
  cache.delete(key);
}

export function clearAllCache() {
  cache.clear();
}

export async function preloadData() {
  return Promise.all([
  ])
} 