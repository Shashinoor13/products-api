import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import ProductList from "@/features/products/productList";
import ProductForm from "@/features/products/ProductForm";

import type { CreateProductDto } from "@/daos/product.daos";
import CreateProductButton from "@/components/common/new_product";

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Mode is used to determine if we are creating or editing a product
  // and also used for persisting state in the URL
  const mode = searchParams.get("mode");
  const editId = searchParams.get("id");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: productsData, isLoading, error } = useProducts({ page, limit });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const showModal = mode === "create" || mode === "edit";



  const openEditModal = (id: number) => {
    navigate(`?mode=edit&id=${id}`);
  };

  const closeModal = () => {
    navigate("/");
  };

  const handleSubmit = async (formData: CreateProductDto) => {
    if (mode === "edit" && editId) {
      await updateMutation.mutateAsync({ id: editId, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    closeModal();
  };

  const handleDeleteClick = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <CreateProductButton/>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error.message}
        </div>
      )}

      {showModal && (
        <ProductForm
          productId={editId}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      )}

      <ProductList
        data={productsData?.data || []}
        loading={isLoading}
        page={page}
        total={productsData?.total || 0}
        totalPages={productsData?.totalPages || 0}
        onEdit={openEditModal}
        onDelete={handleDeleteClick}
        onPageChange={setPage}
        onLimitChange={setLimit}
        limit={limit}
      />
    </div>
  );
}


