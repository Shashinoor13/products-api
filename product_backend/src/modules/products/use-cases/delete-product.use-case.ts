import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class DeleteProductUseCase  {
  constructor(private readonly repo: ProductRepository) {}

  protected removeEntity(id: string): Promise<void> {
    return this.repo.remove(id);
  }

  execute(id: string) {
    return this.removeEntity(id);
  }
}
