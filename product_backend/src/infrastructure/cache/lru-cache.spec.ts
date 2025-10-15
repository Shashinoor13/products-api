import { LRUCache } from './lru-cache';

describe('LRUCache', () => {
  describe('Basic Operations', () => {
    let cache: LRUCache<string>;

    beforeEach(() => {
      cache = new LRUCache<string>(3);
    });

    it('should create cache with correct size', () => {
      expect(cache.size).toBe(0);
    });

    it('should set and get a value', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
      expect(cache.size).toBe(1);
    });

    it('should return undefined for non-existent key', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should update existing key', () => {
      cache.set('key1', 'value1');
      cache.set('key1', 'value2');
      expect(cache.get('key1')).toBe('value2');
      expect(cache.size).toBe(1);
    });

    it('should delete a key', () => {
      cache.set('key1', 'value1');
      const deleted = cache.delete('key1');
      expect(deleted).toBe(true);
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.size).toBe(0);
    });

    it('should return false when deleting non-existent key', () => {
      const deleted = cache.delete('nonexistent');
      expect(deleted).toBe(false);
    });

    it('should clear all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.get('key3')).toBeUndefined();
    });
  });

  describe('LRU Eviction', () => {
    let cache: LRUCache<string>;

    beforeEach(() => {
      cache = new LRUCache<string>(3);
    });

    it('should evict least recently used item when capacity is exceeded', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // This should evict key1

      expect(cache.size).toBe(3);
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });

    it('should update LRU order when accessing items', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      // Access key1 to make it most recently used
      cache.get('key1');

      // Add key4, should evict key2 (least recently used)
      cache.set('key4', 'value4');

      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });

    it('should update LRU order when updating items', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      // Update key1 to make it most recently used
      cache.set('key1', 'updated1');

      // Add key4, should evict key2 (least recently used)
      cache.set('key4', 'value4');

      expect(cache.get('key1')).toBe('updated1');
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });
  });


  describe('Configuration', () => {
    it('should accept number as config', () => {
      const cache = new LRUCache<string>(5);
      expect(cache.size).toBe(0);

      for (let i = 1; i <= 5; i++) {
        cache.set(`key${i}`, `value${i}`);
      }
      expect(cache.size).toBe(5);

      // Adding one more should evict the first
      cache.set('key6', 'value6');
      expect(cache.size).toBe(5);
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should accept object as config', () => {
      const cache = new LRUCache<string>({ maxSize: 2, ttl: 1000 });
      expect(cache.size).toBe(0);

      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      expect(cache.size).toBe(2);

      cache.set('key3', 'value3');
      expect(cache.size).toBe(2);
      expect(cache.get('key1')).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle cache with size 1', () => {
      const cache = new LRUCache<string>(1);

      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');

      cache.set('key2', 'value2');
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBe('value2');
    });

    it('should handle empty string as key', () => {
      const cache = new LRUCache<string>(3);

      cache.set('', 'empty key');
      expect(cache.get('')).toBe('empty key');
    });

    it('should handle null/undefined values', () => {
      const cache = new LRUCache<any>(3);

      cache.set('null', null);
      cache.set('undefined', undefined);

      expect(cache.get('null')).toBe(null);
      expect(cache.get('undefined')).toBe(undefined);
    });

    it('should maintain correct size after mixed operations', () => {
      const cache = new LRUCache<string>(3);

      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      expect(cache.size).toBe(2);

      cache.delete('key1');
      expect(cache.size).toBe(1);

      cache.set('key3', 'value3');
      cache.set('key4', 'value4');
      expect(cache.size).toBe(3);

      cache.clear();
      expect(cache.size).toBe(0);
    });
  });
});
