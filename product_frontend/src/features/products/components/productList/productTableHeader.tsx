interface ProductTableHeaderProps {
    allSelected: boolean;
    someSelected: boolean;
    onSelectAll: (checked: boolean) => void;
}

function ProductTableHeader({ allSelected, someSelected, onSelectAll }: ProductTableHeaderProps) {
    return <thead className="bg-gray-50">
        <tr>
            <th className="px-6 py-3 text-left">
                <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                        if (input) {
                            input.indeterminate = someSelected;
                        }
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
            </th>
        </tr>
    </thead>;
}
export default ProductTableHeader;