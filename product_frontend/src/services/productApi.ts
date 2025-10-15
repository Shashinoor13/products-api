
import type { CreateProductDto, PaginationQuery, PaginationResponse, Product, UpdateProductDto } from '@/daos/product.daos';
import axios from 'axios';

// Get the API base URL from environment variable or default to localhost:3000
const API_BASE_URL = import.meta.env.VITE_PRODUCT_BACKEND_ENDPOINT || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Get all products with pagination
export async function getAllProducts(query?: PaginationQuery): Promise<PaginationResponse<Product>> {
  const response = await apiClient.get<PaginationResponse<Product>>('/products', {
    params: query,
  });
  return response.data;
}

// Get a single product by ID
export async function getProduct(id: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

// Create a new product
export async function createProduct(data: CreateProductDto): Promise<Product> {
  const response = await apiClient.post<Product>('/products', data);
  return response.data;
}

// Update an existing product
export async function updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
  const response = await apiClient.put<Product>(`/products/${id}`, data);
  return response.data;
}

// Delete a product
export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
