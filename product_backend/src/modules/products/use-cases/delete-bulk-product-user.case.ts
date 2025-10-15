import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class DeleteBulkProductUseCase {
  constructor(private readonly repo: ProductRepository) {}

  protected deleteEntity(data: string[]): Promise<void> {
    return this.repo.deleteBulk(data);
  }



  execute(dto: string[]) {
    return this.deleteEntity(dto as any);
  }
}
