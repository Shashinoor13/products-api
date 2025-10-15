import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productApi';
import type { CreateProductDto, PaginationQuery, UpdateProductDto } from '@/daos/product.daos';

export const tableKeys = {
  all: ['table-products'] as const,
  list: (page: number, limit: number) => [...tableKeys.all, 'list', { page, limit }] as const,
};

interface UseTableResult {
  data: any[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  handleCreate: (product: CreateProductDto) => Promise<void>;
  handleUpdate: (id: string, product: UpdateProductDto) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  refresh: () => void;
}

export function useTable(initialPage = 1, initialLimit = 10): UseTableResult {
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const queryClient = useQueryClient();

  // Fetch products with TanStack Query
  const {
    data: response,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: tableKeys.list(page, limit),
    queryFn: () => {
      const query: PaginationQuery = { page, limit };
      return getAllProducts(query);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProductDto) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
    },
  });

  const handleCreate = async (product: CreateProductDto): Promise<void> => {
    await createMutation.mutateAsync(product);
  };

  const handleUpdate = async (id: string, product: UpdateProductDto): Promise<void> => {
    await updateMutation.mutateAsync({ id, data: product });
  };

  const handleDelete = async (id: number): Promise<void> => {
    await deleteMutation.mutateAsync(id);
  };

  const refresh = (): void => {
    refetch();
  };

  return {
    data: response?.data || [],
    loading: isLoading,
    error: queryError ? (queryError as Error).message : null,
    page,
    limit,
    total: response?.total || 0,
    totalPages: response?.totalPages || 0,
    setPage,
    setLimit,
    handleCreate,
    handleUpdate,
    handleDelete,
    refresh,
  };
}
