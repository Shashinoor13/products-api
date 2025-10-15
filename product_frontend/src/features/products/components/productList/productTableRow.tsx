
import { Button } from "@/components/ui/button";
import { PenIcon } from "lucide-react";
import type { Product } from "@/daos/product.daos";
import DeleteConfirmation from "./deleteConfirmation";



const ProductRow = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => (
  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {product.id}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {product.name}
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
      {product.description || "-"}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
      ${product.price}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(product.id)}
        >
          <PenIcon className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <DeleteConfirmation
          productName={product.name}
          onConfirm={() => onDelete(product.id)}
        />
      </div>
    </td>
  </tr>
);




export default ProductRow;