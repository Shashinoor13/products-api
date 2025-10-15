import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
