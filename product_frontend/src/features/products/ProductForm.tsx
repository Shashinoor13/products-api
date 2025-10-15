import { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useTable";
import { Spinner } from "@/components/ui/spinner";
import type { CreateProductDto } from "@/daos/product.daos";

// Zod validation schema
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  price: z
    .number()
    .positive("Price must be greater than 0")
    .max(999999.99, "Price is too large"),
});

type ValidationErrors = {
  name?: string;
  description?: string;
  price?: string;
};

interface ProductFormProps {
  productId?: string | null;
  onSubmit: (data: CreateProductDto) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ productId, onSubmit, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // TanStack Query handles data fetching automatically
  const { data: product, isLoading } = useProduct(productId || null);

  // Derive initial form values from product data (memoized to prevent unnecessary recalculation)
  const initialFormData = useMemo(() => ({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    priceStr: product?.price?.toString() || "0",
  }), [product]);

  const [formData, setFormData] = useState(initialFormData);

  // Only sync when product data actually changes from the query
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Prepare data for validation
    const dataToValidate = {
      name: formData.name,
      description: formData.description || "",
      price: parseFloat(formData.priceStr),
    };

    // Validate with Zod
    const result = productSchema.safeParse(dataToValidate);

    if (!result.success) {
      // Extract and set validation errors
      const validationErrors: ValidationErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ValidationErrors;
        if (field) {
          validationErrors[field] = issue.message;
        }
      });
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
      setFormData({ name: "", description: "", price: 0, priceStr: "0" });
      setErrors({});
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div 
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex justify-end"
        onClick={onCancel}
      >
        <div 
          className="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 h-full flex items-center justify-center">
            <div className="text-center">
                <Spinner />
              <p className="text-lg text-gray-600">Loading product data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex justify-end"
      onClick={onCancel}
    >
      <div 
        className="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {product ? "Edit Product" : "Create New Product"}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                // Clear error when user starts typing
                if (errors.name) {
                  setErrors({ ...errors, name: undefined });
                }
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                errors.name ? "border-red-500" : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: undefined });
                }
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                errors.description ? "border-red-500" : ""
              }`}
              rows={4}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.priceStr}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  priceStr: e.target.value,
                  price: parseFloat(e.target.value) || 0,
                });
                // Clear error when user starts typing
                if (errors.price) {
                  setErrors({ ...errors, price: undefined });
                }
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                errors.price ? "border-red-500" : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <div className="sticky bottom-0 bg-white pt-6 pb-2 border-t mt-8 -mx-8 px-8">
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : product ? "Update" : "Create"}
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
