# LRU Cache Implementation

## Quick Start

```typescript
import { LRUCache } from './infrastructure/cache/lru-cache';

// Simple usage - just specify max size
const cache = new LRUCache(3);
cache.set("a", 1);
cache.set("b", 2);
cache.set("c", 3);
cache.get("a");      // returns 1
cache.set("d", 4);   // evicts "b" (least recently used)
cache.get("b");      // returns undefined
```

## Installation

The cache is already set up in your NestJS application. You can use it in two ways:

### 1. Standalone Usage (Simple)

Create a cache instance anywhere in your code:

```typescript
const cache = new LRUCache(3);  // Max 3 items
```

### 2. NestJS Dependency Injection

Inject it into your services/use-cases:

```typescript
import { Injectable } from '@nestjs/common';
import { LRUCache } from '../../../infrastructure/cache/lru-cache';

@Injectable()
export class MyService {
  constructor(private readonly cache: LRUCache) {}

  async getData(key: string) {
    const cached = this.cache.get(key);
    if (cached) return cached;
    
    // Fetch from database...
    const data = await this.fetchFromDB(key);
    this.cache.set(key, data);
    return data;
  }
}
```

## API Reference

### Constructor

```typescript
// Simple: just max size
new LRUCache(maxSize: number)

// Advanced: with TTL
new LRUCache({ maxSize: number, ttl?: number })
```

**Examples:**
```typescript
const cache1 = new LRUCache(100);                              // 100 items max
const cache2 = new LRUCache({ maxSize: 100, ttl: 60000 });   // 100 items, 1 min TTL
```

### Methods

#### `get(key: string): T | undefined`
Get a value from cache. Returns `undefined` if not found or expired.

```typescript
const value = cache.get("myKey");
if (value) {
  console.log("Cache hit!", value);
} else {
  console.log("Cache miss");
}
```

#### `set(key: string, value: T, ttl?: number): void`
Store a value in cache.

```typescript
cache.set("user:123", { id: 123, name: "John" });
cache.set("temp", "data", 5000);  // Custom TTL: 5 seconds
```

#### `has(key: string): boolean`
Check if key exists (and is not expired).

```typescript
if (cache.has("user:123")) {
  console.log("User is cached");
}
```

#### `delete(key: string): boolean`
Remove a key from cache.

```typescript
cache.delete("user:123");
```

#### `clear(): void`
Remove all entries.

```typescript
cache.clear();
```

#### `size(): number`
Get current number of items.

```typescript
console.log(`Cache has ${cache.size()} items`);
```

#### `keys(): string[]`
Get all keys (most → least recently used).

```typescript
const allKeys = cache.keys();
```

#### `values(): T[]`
Get all values (most → least recently used).

```typescript
const allValues = cache.values();
```

#### `getStats(): object`
Get cache statistics.

```typescript
const stats = cache.getStats();
// { size: 50, maxSize: 100, utilizationPercent: 50, ttl: 60000 }
```

## Examples

### Example 1: Basic Usage

```typescript
const cache = new LRUCache(3);

cache.set("a", 1);
cache.set("b", 2);
cache.set("c", 3);

console.log(cache.get("a"));  // 1

// Adding "d" will evict "b" (least recently used)
cache.set("d", 4);

console.log(cache.get("b"));  // undefined (evicted)
console.log(cache.get("c"));  // 3
console.log(cache.get("d"));  // 4
```

### Example 2: Caching API Responses

```typescript
const apiCache = new LRUCache<any>({ maxSize: 100, ttl: 60000 }); // 1 min

async function fetchUser(userId: string) {
  const cacheKey = `user:${userId}`;
  
  // Try cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    console.log('Cache hit!');
    return cached;
  }
  
  // Fetch from API
  const user = await fetch(`/api/users/${userId}`).then(r => r.json());
  
  // Store in cache
  apiCache.set(cacheKey, user);
  
  return user;
}
```

### Example 3: Product List Caching

```typescript
const productCache = new LRUCache<Product[]>(50);

async function getProducts(page: number, limit: number) {
  const cacheKey = `products:page:${page}:limit:${limit}`;
  
  const cached = productCache.get(cacheKey);
  if (cached) return cached;
  
  const products = await db.query('SELECT * FROM products LIMIT $1 OFFSET $2', 
    [limit, (page - 1) * limit]
  );
  
  productCache.set(cacheKey, products);
  return products;
}

// Invalidate on create/update
function onProductChange() {
  const keys = productCache.keys();
  keys.forEach(key => {
    if (key.startsWith('products:')) {
      productCache.delete(key);
    }
  });
}
```

## How LRU Works

LRU (Least Recently Used) means:
- When you `get()` or `set()` a key, it becomes "most recently used"
- When the cache is full, the "least recently used" item is evicted
- This ensures frequently accessed items stay in cache

**Visual Example:**

```
Cache (max size = 3):

set("a", 1)  → [a]
set("b", 2)  → [b, a]
set("c", 3)  → [c, b, a]
get("a")     → [a, c, b]     // "a" moves to front
set("d", 4)  → [d, a, c]     // "b" evicted (least recently used)
```

## Performance

- **Time Complexity:**
  - `get()`: O(1)
  - `set()`: O(1)
  - `delete()`: O(1)
  - `has()`: O(1)

- **Space Complexity:** O(n) where n is maxSize

## Best Practices

### 1. Choose Appropriate Cache Size

```typescript
// For small datasets
const cache = new LRUCache(10);

// For larger applications
const cache = new LRUCache(1000);
```

### 2. Use Descriptive Keys

```typescript
// Good ✅
cache.set('user:123', userData);
cache.set('product:456:details', productData);

// Bad ❌
cache.set('u123', userData);
cache.set('p456', productData);
```

### 3. Invalidate on Mutations

```typescript
function createProduct(product: Product) {
  const newProduct = await db.insert(product);
  
  // Invalidate related caches
  cache.delete('products:all');
  cache.delete(`products:category:${product.category}`);
  
  return newProduct;
}
```

## Testing

Run the example:

```bash
npm run build
node dist/infrastructure/cache/example.js
```

Run tests:

```bash
npm test -- lru-cache.spec
```

## TypeScript Support

Full TypeScript support with generics:

```typescript
// Cache strings
const stringCache = new LRUCache<string>(10);
stringCache.set('key', 'value');

// Cache objects
interface User {
  id: number;
  name: string;
}
const userCache = new LRUCache<User>(100);
userCache.set('user:1', { id: 1, name: 'John' });

// Cache any type
const anyCache = new LRUCache<any>(50);
```
