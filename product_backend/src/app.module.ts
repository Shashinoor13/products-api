import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { LoggerMiddleware } from './infrastructure/middleware/logger.middleware';

@Module({
  imports: [InfrastructureModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
