/**
 * QueryCache Tests
 *
 * Tests for the in-memory query cache service.
 */

import { queryCache, CACHE_KEYS } from '../queryCache';

describe('QueryCache', () => {
  beforeEach(() => {
    // Clear cache before each test
    queryCache.clear();
  });

  describe('set and get', () => {
    it('should store and retrieve data', () => {
      queryCache.set('test-key', { value: 42 });
      const result = queryCache.get<{ value: number }>('test-key');
      expect(result).toEqual({ value: 42 });
    });

    it('should return null for non-existent keys', () => {
      const result = queryCache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should handle different data types', () => {
      queryCache.set('string', 'hello');
      queryCache.set('number', 123);
      queryCache.set('array', [1, 2, 3]);
      queryCache.set('object', { a: 1, b: 2 });

      expect(queryCache.get('string')).toBe('hello');
      expect(queryCache.get('number')).toBe(123);
      expect(queryCache.get('array')).toEqual([1, 2, 3]);
      expect(queryCache.get('object')).toEqual({ a: 1, b: 2 });
    });

    it('should handle params in cache key', () => {
      queryCache.set('query', 'result1', ['param1']);
      queryCache.set('query', 'result2', ['param2']);

      expect(queryCache.get('query', ['param1'])).toBe('result1');
      expect(queryCache.get('query', ['param2'])).toBe('result2');
      expect(queryCache.get('query')).toBeNull(); // No params
    });

    it('should generate different keys for different params', () => {
      queryCache.set('test', 'a', [1, 2]);
      queryCache.set('test', 'b', [1, 3]);

      expect(queryCache.get('test', [1, 2])).toBe('a');
      expect(queryCache.get('test', [1, 3])).toBe('b');
    });
  });

  describe('TTL expiration', () => {
    it('should return data before TTL expires', () => {
      queryCache.set('test', 'value', undefined, 1000); // 1 second TTL

      // Immediately after setting
      expect(queryCache.get('test')).toBe('value');

      // After 500ms (still valid)
      jest.advanceTimersByTime(500);
      expect(queryCache.get('test')).toBe('value');
    });

    it('should return null after TTL expires', () => {
      queryCache.set('test', 'value', undefined, 1000); // 1 second TTL

      // Advance past TTL
      jest.advanceTimersByTime(1001);

      expect(queryCache.get('test')).toBeNull();
    });

    it('should use default TTL when not specified', () => {
      queryCache.set('test', 'value');

      // Should be valid at 29 seconds
      jest.advanceTimersByTime(29000);
      expect(queryCache.get('test')).toBe('value');

      // Should be expired at 31 seconds (default is 30s)
      jest.advanceTimersByTime(2000);
      expect(queryCache.get('test')).toBeNull();
    });

    it('should clean up expired entries on get', () => {
      queryCache.set('test', 'value', undefined, 100);
      jest.advanceTimersByTime(101);

      // First get should return null and clean up
      expect(queryCache.get('test')).toBeNull();

      // Verify entry was cleaned up by setting new value
      queryCache.set('test', 'new-value');
      expect(queryCache.get('test')).toBe('new-value');
    });
  });

  describe('invalidate', () => {
    it('should remove specific cache entry', () => {
      queryCache.set('key1', 'value1');
      queryCache.set('key2', 'value2');

      queryCache.invalidate('key1');

      expect(queryCache.get('key1')).toBeNull();
      expect(queryCache.get('key2')).toBe('value2');
    });

    it('should invalidate entry with params', () => {
      queryCache.set('query', 'result1', ['param1']);
      queryCache.set('query', 'result2', ['param2']);

      queryCache.invalidate('query', ['param1']);

      expect(queryCache.get('query', ['param1'])).toBeNull();
      expect(queryCache.get('query', ['param2'])).toBe('result2');
    });

    it('should handle invalidating non-existent key', () => {
      // Should not throw
      expect(() => queryCache.invalidate('non-existent')).not.toThrow();
    });
  });

  describe('invalidateByPrefix', () => {
    it('should invalidate all entries with matching prefix', () => {
      queryCache.set('user:1', 'data1');
      queryCache.set('user:2', 'data2');
      queryCache.set('post:1', 'post-data');

      queryCache.invalidateByPrefix('user:');

      expect(queryCache.get('user:1')).toBeNull();
      expect(queryCache.get('user:2')).toBeNull();
      expect(queryCache.get('post:1')).toBe('post-data');
    });

    it('should handle no matching entries', () => {
      queryCache.set('key1', 'value1');

      expect(() => queryCache.invalidateByPrefix('other:')).not.toThrow();
      expect(queryCache.get('key1')).toBe('value1');
    });
  });

  describe('clear', () => {
    it('should remove all cached entries', () => {
      queryCache.set('key1', 'value1');
      queryCache.set('key2', 'value2');
      queryCache.set('key3', 'value3');

      queryCache.clear();

      expect(queryCache.get('key1')).toBeNull();
      expect(queryCache.get('key2')).toBeNull();
      expect(queryCache.get('key3')).toBeNull();
    });
  });

  describe('getOrFetch', () => {
    it('should return cached data if available', async () => {
      const fetchFn = jest.fn().mockResolvedValue('fetched');
      queryCache.set('test', 'cached');

      const result = await queryCache.getOrFetch('test', fetchFn);

      expect(result).toBe('cached');
      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('should fetch and cache data if not cached', async () => {
      const fetchFn = jest.fn().mockResolvedValue('fetched');

      const result = await queryCache.getOrFetch('test', fetchFn);

      expect(result).toBe('fetched');
      expect(fetchFn).toHaveBeenCalledTimes(1);

      // Verify it was cached
      expect(queryCache.get('test')).toBe('fetched');
    });

    it('should fetch again after TTL expires', async () => {
      const fetchFn = jest
        .fn()
        .mockResolvedValueOnce('first')
        .mockResolvedValueOnce('second');

      // First fetch
      const result1 = await queryCache.getOrFetch('test', fetchFn, undefined, 1000);
      expect(result1).toBe('first');

      // Expire the cache
      jest.advanceTimersByTime(1001);

      // Second fetch
      const result2 = await queryCache.getOrFetch('test', fetchFn, undefined, 1000);
      expect(result2).toBe('second');
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('should use params for cache key', async () => {
      const fetchFn = jest.fn().mockImplementation((id) =>
        Promise.resolve(`data-${id}`)
      );

      // This test verifies params are passed correctly to generateKey
      await queryCache.getOrFetch('query', () => fetchFn(1), [1]);
      await queryCache.getOrFetch('query', () => fetchFn(2), [2]);

      // Both should have been fetched since they have different params
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('should use custom TTL', async () => {
      const fetchFn = jest.fn().mockResolvedValue('data');

      await queryCache.getOrFetch('test', fetchFn, undefined, 500);

      // Should still be cached at 400ms
      jest.advanceTimersByTime(400);
      expect(queryCache.get('test')).toBe('data');

      // Should be expired at 600ms
      jest.advanceTimersByTime(200);
      expect(queryCache.get('test')).toBeNull();
    });
  });

  describe('CACHE_KEYS', () => {
    it('should have expected cache key constants', () => {
      expect(CACHE_KEYS.EXERCISE_STATS).toBe('exerciseStats');
      expect(CACHE_KEYS.ALL_TRACK_PROGRESS).toBe('allTrackProgress');
      expect(CACHE_KEYS.XP_STATE).toBe('xpState');
      expect(CACHE_KEYS.UNLOCKED_ITEMS).toBe('unlockedItems');
      expect(CACHE_KEYS.ITEM_STATS).toBe('itemStats');
    });
  });
});
