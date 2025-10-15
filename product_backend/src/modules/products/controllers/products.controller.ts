import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { UpdateProductDto } from '../dtos/update-product.dto';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { CreateProductUseCase } from '../use-cases/create-product.use-case';
import { GetAllProductsUseCase } from '../use-cases/get-all-products.use-case';
import { GetProductUseCase } from '../use-cases/get-product.use-case';
import { UpdateProductUseCase } from '../use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../use-cases/delete-product.use-case';
import { CreateProductDto } from '../dtos/create-product.dto';
import { CreateBulkProductUseCase } from '../use-cases/create-bulk-product.use.case';
import { DeleteBulkProductUseCase } from '../use-cases/delete-bulk-product-user.case';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly createUseCase: CreateProductUseCase,
        private readonly createBulkUseCase: CreateBulkProductUseCase,
        private readonly deleteBulkUseCase: DeleteBulkProductUseCase,
        private readonly getAllUseCase: GetAllProductsUseCase,
        private readonly getUseCase: GetProductUseCase,
        private readonly updateUseCase: UpdateProductUseCase,
        private readonly deleteUseCase: DeleteProductUseCase,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'Returns paginated products' })
    async getAllProducts(@Query() query: PaginationQueryDto) {
        return this.getAllUseCase.execute(query.page, query.limit);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    async createProduct(@Body() dto: CreateProductDto) {
        return this.createUseCase.execute(dto);
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create multiple products' })
    @ApiResponse({ status: 201, description: 'Products created successfully' })
    async createBulkProducts(@Body() dtos: CreateProductDto[]) {
        return this.createBulkUseCase.execute(dtos);
    }

    @Delete('bulk')
    @ApiOperation({ summary: 'Delete multiple products' })
    @ApiResponse({ status: 200, description: 'Products deleted successfully' })
    async deleteBulkProducts(@Body() ids: string[]) {
        await this.deleteBulkUseCase.execute(ids);
        return { deleted: true };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Returns a single product' })
    async getProductById(@Param('id') id: string) {
        return this.getUseCase.execute(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a product' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    async deleteProduct(@Param('id') id: string) {
        await this.deleteUseCase.execute(id);
        return { deleted: true };
    }
}
