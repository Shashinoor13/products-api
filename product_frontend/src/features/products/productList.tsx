import { useState } from "react";
import type { Product } from "@/daos/product.daos";
import EmptyState from "./components/productList/emptyList";
import LoadingState from "./components/productList/loadingState";
import Pagination from "./components/productList/paginationControls";
import ProductRow from "./components/productList/productTableRow";
import ProductTableHeader from "./components/productList/productTableHeader";
import BulkDeleteConfirmation from "./components/productList/bulkDeleteConfirmation";


interface ProductListProps {
  data: Product[];
  loading: boolean;
  page: number;
  total: number;
  totalPages: number;
  limit: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: string[]) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function ProductList({
  data,
  loading,
  page,
  total,
  totalPages,
  limit,
  onEdit,
  onDelete,
  onBulkDelete,
  onPageChange,
  onLimitChange,
}: ProductListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (loading) {
    return <LoadingState />;
  }

  const hasProducts = data && data.length > 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(data.map(p => p.id.toString())));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };


  const allSelected = hasProducts && selectedIds.size === data.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div className="space-y-4">
      {/* Bulk Delete Actions */}
      {selectedIds.size > 0 && (
        <BulkDeleteConfirmation
          productCount={selectedIds.size}
          onConfirm={() => {
            onBulkDelete(Array.from(selectedIds));
            setSelectedIds(new Set());
          }}
        />
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <ProductTableHeader 
              allSelected={allSelected}
              someSelected={someSelected}
              onSelectAll={handleSelectAll}
            />
            <tbody className="bg-white divide-y divide-gray-200">
              {!hasProducts ? (
                <EmptyState />
              ) : (
                data.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    selected={selectedIds.has(product.id.toString())}
                    onSelect={handleSelectOne}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {hasProducts && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}

