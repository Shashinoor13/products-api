import { Logger } from "@nestjs/common";

class CacheNode<T> {
    constructor(
        public key: string,
        public value: T,
        public prev: CacheNode<T> | null = null,
        public next: CacheNode<T> | null = null,
        public expiresAt?: number,
    ) { }
}


export interface LRUCacheConfig {
    maxSize: number;
    ttl?: number; // Time to live in milliseconds
}

export class LRUCache<T = any> {
    private readonly logger = new Logger(LRUCache.name);
    private cache: Map<string, CacheNode<T>>;
    private head: CacheNode<T> | null = null;
    private tail: CacheNode<T> | null = null;
    private readonly maxSize: number;
    private readonly ttl?: number;

    /**
     * Create a new LRU Cache
     * @param config - Max size (number) or configuration object
     * @example
     * new LRUCache(3)
     * new LRUCache({ maxSize: 100, ttl: 60000 })
     */
    constructor(config: number | LRUCacheConfig) {
        if (typeof config === 'number') {
            this.maxSize = config;
            this.ttl = undefined;
        } else {
            this.maxSize = config.maxSize;
            this.ttl = config.ttl;
        }
        this.cache = new Map();
    }
    get size(): number {
        return this.cache.size;
    }

    get keys(): string[] {
        return Array.from(this.cache.keys());
    }

    set(key: string, value: T): void {
        this.logger.log(`Setting cache for key: ${key}`);
        let node = this.cache.get(key);
        const now = Date.now();

        if (node) {
            this.logger.log(`Updating cache for key: ${key}`);
            node.value = value;
            if (this.ttl) {
                node.expiresAt = now + this.ttl;
            }
            this.moveToHead(node);
        } else {
            this.logger.log(`Adding new cache entry for key: ${key}`);
            if (this.cache.size >= this.maxSize) {
                this.evict();
            }
            node = new CacheNode(key, value);
            if (this.ttl) {
                node.expiresAt = now + this.ttl;
            }
            this.addToHead(node);
            this.cache.set(key, node);
        }
    }

    get(key: string): T | undefined {
        this.logger.log(`Getting cache for key: ${key}`);
        const node = this.cache.get(key);
        const now = Date.now();

        if (!node){
            this.logger.log(`Cache miss for key: ${key}`);
            return undefined;
        }

        if (node.expiresAt && node.expiresAt < now) {
            this.cache.delete(key);
            this.removeNode(node);
            return undefined;
        }

        this.moveToHead(node);
        return node.value;
    }
    
    delete(key: string): boolean {
        this.logger.log(`Deleting cache for key: ${key}`);
        const node = this.cache.get(key);
        if (!node) return false;
        this.cache.delete(key);
        this.removeNode(node);
        return true;
    }

    clear(): void {
        this.logger.log(`Clearing entire cache`);
        this.cache.clear();
        this.head = null;
        this.tail = null;
    }

    private removeNode(node: CacheNode<T>): void {
        this.logger.log(`Removing node for key: ${node.key}`);
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
    }
    private evict(): void {
        this.logger.log(`Evicting least recently used cache entry`);
        if (this.tail) {
            this.cache.delete(this.tail.key);
            this.removeNode(this.tail);
        }
    }
    private addToHead(node: CacheNode<T>): void {
        this.logger.log(`Adding node to head for key: ${node.key}`);
        node.next = this.head;
        node.prev = null;
        if (this.head) {
            this.head.prev = node;
        }
        this.head = node;
        if (!this.tail) {
            this.tail = node;
        }
    }
    private moveToHead(node: CacheNode<T>): void {
        this.logger.log(`Moving node to head for key: ${node.key}`);
        if (node === this.head) return;

        this.removeNode(node);
        this.addToHead(node);
    }
}
