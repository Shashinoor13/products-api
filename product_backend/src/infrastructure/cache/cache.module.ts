import { Global, Module } from '@nestjs/common';
import { LRUCache, LRUCacheConfig } from './lru-cache';


const DEFAULT_CACHE_CONFIG: LRUCacheConfig = {
  maxSize: 2,
  ttl: 5 * 60 * 1000, // Minutes: 5
};

@Global()
@Module({
  providers: [
    {
      provide: 'CACHE_CONFIG',
      useValue: DEFAULT_CACHE_CONFIG,
    },
    {
      provide: LRUCache,
      useFactory: (config: LRUCacheConfig) => {
        return new LRUCache(config);
      },
      inject: ['CACHE_CONFIG'],
    },
  ],
  exports: [LRUCache],
})
export class CacheModule {}
