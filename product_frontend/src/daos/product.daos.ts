export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
