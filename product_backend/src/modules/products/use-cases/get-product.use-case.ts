import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../entities/product.entity';

@Injectable()
export class GetProductUseCase {
  constructor(private readonly repo: ProductRepository) { }

  protected findOneEntity(id: string): Promise<Product | null> {
    return this.repo.findOne(id);
  }

  execute(id: string) {
    return this.findOneEntity(id);
  }
}
