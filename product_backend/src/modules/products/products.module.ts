import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductUseCase } from './use-cases/create-product.use-case';
import { GetAllProductsUseCase } from './use-cases/get-all-products.use-case';
import { GetProductUseCase } from './use-cases/get-product.use-case';
import { UpdateProductUseCase } from './use-cases/update-product.use-case';
import { DeleteProductUseCase } from './use-cases/delete-product.use-case';
import { CreateBulkProductUseCase } from './use-cases/create-bulk-product.use.case';
import { DeleteBulkProductUseCase } from './use-cases/delete-bulk-product-user.case';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    ProductRepository,
    CreateProductUseCase,
    CreateBulkProductUseCase,
    DeleteBulkProductUseCase,
    GetAllProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}
