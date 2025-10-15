import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../entities/product.entity';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';

@Injectable()
export class GetAllProductsUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(page: number = 1, limit: number = 10): Promise<PaginationResponseDto<Product>> {
    const [data, total] = await this.repo.findAll(page, limit);
    return new PaginationResponseDto(data, total, page, limit);
  }
}
