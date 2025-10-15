import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../modules/products/entities/product.entity';

export const pgConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT!, 10) || 5432,
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
  database: process.env.PG_DATABASE || 'products_db',
  entities: [Product],
  synchronize: true, // Note: Set to false in production
});