/**
 * Query Cache
 *
 * Simple in-memory cache with TTL for database query results.
 * Reduces redundant queries on tab navigation and screen refreshes.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class QueryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number = 30000; // 30 seconds

  /**
   * Generate a cache key from query identifier and parameters
   */
  private generateKey(queryId: string, params?: unknown[]): string {
    if (!params || params.length === 0) {
      return queryId;
    }
    return `${queryId}:${JSON.stringify(params)}`;
  }

  /**
   * Check if a cache entry is still valid
   */
  private isValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(queryId: string, params?: unknown[]): T | null {
    const key = this.generateKey(queryId, params);
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (entry && this.isValid(entry)) {
      return entry.data;
    }

    // Clean up expired entry
    if (entry) {
      this.cache.delete(key);
    }

    return null;
  }

  /**
   * Store data in cache with optional custom TTL
   */
  set<T>(queryId: string, data: T, params?: unknown[], ttl?: number): void {
    const key = this.generateKey(queryId, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
    });
  }

  /**
   * Invalidate a specific cache entry
   */
  invalidate(queryId: string, params?: unknown[]): void {
    const key = this.generateKey(queryId, params);
    this.cache.delete(key);
  }

  /**
   * Invalidate all entries matching a query ID prefix
   * Useful for invalidating all variants of a query type
   */
  invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Execute a query function with caching
   * If cached data exists and is valid, return it
   * Otherwise execute the query and cache the result
   */
  async getOrFetch<T>(
    queryId: string,
    fetchFn: () => Promise<T>,
    params?: unknown[],
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(queryId, params);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    this.set(queryId, data, params, ttl);
    return data;
  }
}

// Singleton instance
export const queryCache = new QueryCache();

// Cache query identifiers for consistency
export const CACHE_KEYS = {
  EXERCISE_STATS: 'exerciseStats',
  ALL_TRACK_PROGRESS: 'allTrackProgress',
  XP_STATE: 'xpState',
  UNLOCKED_ITEMS: 'unlockedItems',
  ITEM_STATS: 'itemStats',
} as const;
