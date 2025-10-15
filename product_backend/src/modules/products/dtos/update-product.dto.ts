import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Updated Product Name', description: 'The name of the product' })
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description', description: 'Product description' })
  description?: string;

  @ApiPropertyOptional({ example: 149.99, description: 'Product price' })
  price?: number;
}
