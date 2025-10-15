import CreateProductButton from "@/components/common/new_product";


const EmptyState = () => (
  <tr>
    <td colSpan={5} className="px-6 py-12 text-center">
      <div className="flex flex-col items-center justify-center text-gray-500">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm mt-1">Create your first product to get started!</p>
        <div className="mt-4">
        <CreateProductButton/>
        </div>
      </div>
    </td>
  </tr>
);

export default EmptyState;