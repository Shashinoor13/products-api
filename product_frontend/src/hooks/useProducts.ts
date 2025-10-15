import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,

} from '../services/productApi';
import type { CreateProductDto, PaginationQuery, UpdateProductDto } from '@/daos/product.daos';


export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: PaginationQuery) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProducts(params?: PaginationQuery) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getAllProducts(params),
  });
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
