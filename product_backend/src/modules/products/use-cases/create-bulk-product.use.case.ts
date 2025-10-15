import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class CreateBulkProductUseCase {
  constructor(private readonly repo: ProductRepository) {}

  protected createEntity(data: Partial<Product>[]): Promise<Product[]> {
    return this.repo.createBulk(data);
  }

  execute(dto: CreateProductDto[]) {
    return this.createEntity(dto as any);
  }
}
