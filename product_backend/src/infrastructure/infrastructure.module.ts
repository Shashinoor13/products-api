import { Module } from '@nestjs/common';
import { pgConfig } from './config/pg.config';
import { CacheModule } from './cache/cache.module';


@Module({
  imports: [
    pgConfig,
    CacheModule,
  ],
  exports: [CacheModule],
})
export class InfrastructureModule {}
