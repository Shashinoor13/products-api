import type { Product } from "@/daos/product.daos";
import EmptyState from "./components/productList/emptyList";
import LoadingState from "./components/productList/loadingState";
import Pagination from "./components/productList/paginationControls";
import ProductRow from "./components/productList/productTableRow";
import ProductTableHeader from "./components/productList/productTableHeader";


interface ProductListProps {
  data: Product[];
  loading: boolean;
  page: number;
  total: number;
  totalPages: number;
  limit: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
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
  onPageChange,
  onLimitChange,
}: ProductListProps) {
  if (loading) {
    return <LoadingState />;
  }

  const hasProducts = data && data.length > 0;

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <ProductTableHeader />
            <tbody className="bg-white divide-y divide-gray-200">
              {!hasProducts ? (
                <EmptyState />
              ) : (
                data.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
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

