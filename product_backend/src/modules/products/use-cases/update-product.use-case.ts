import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class UpdateProductUseCase  {

  constructor(private readonly repo: ProductRepository) {}

  protected updateEntity(id: string, data: Partial<Product>): Promise<Product | null> {
    return this.repo.update(id, data);
  }
  
  execute(id: string, dto: UpdateProductDto) {
    return this.updateEntity(id, dto as any);
  }
}
