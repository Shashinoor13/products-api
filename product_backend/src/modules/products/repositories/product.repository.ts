import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { LRUCache } from '../../../infrastructure/cache/lru-cache';


@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
    private readonly cache: LRUCache<Product | Product[]|[Product[], number]>
  ) {}

  async create(data: Partial<Product>): Promise<Product> {
    const ent = this.repo.create(data);
    const saved = await this.repo.save(ent);
    this.invalidateFindAllCache();
    return saved;
  }

  async findAll(page: number, limit: number): Promise<[Product[], number]> {
    const key = `products:all:page=${page}:limit=${limit}`;
    const cached = this.cache.get(key);
    if (cached) {
      return cached as unknown as [Product[], number];
    }
    const skip = (page - 1) * limit;
    const [data, total] = await this.repo.findAndCount({
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    this.cache.set(key, [data, total] );


    return [data, total];
  }


  async findOne(id: string): Promise<Product | null> {
    const key = `products:${id}`;
    const cached = this.cache.get(key);
    if (cached) {
      return  cached as Product;
    }

    const result = await this.repo.findOneBy({ id });
    if (result) {
      this.cache.set(key, result);
    }
    return result;
  }


  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const key = `products:${id}`;
    this.cache.delete(key);
    await this.repo.update(id, data);
    this.invalidateFindAllCache();
    const updated = await this.findOne(id);
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
    this.cache.delete(`products:${id}`);
    this.invalidateFindAllCache();
  }

  private invalidateFindAllCache() {
    const keys = this.cache.keys;
    for (const key of keys) {
      if (key.startsWith('products:all:')) {
        this.cache.delete(key);
      }
    }
  }
}
