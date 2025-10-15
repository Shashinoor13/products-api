import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name', description: 'The name of the product' })
  name: string;

  @ApiPropertyOptional({ example: 'Product description', description: 'Optional product description' })
  description?: string;

  @ApiPropertyOptional({ example: 99.99, description: 'Product price' })
  price?: number;
}
