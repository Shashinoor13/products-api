import { Button } from "@/components/ui/button";

function Pagination({
    page, totalPages, total, limit, onPageChange, onLimitChange,
}: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}) {
    const optionValues = [1, 5, 10, 20, 50, 100];
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 sm:px-0">
            <div className="text-sm text-gray-700">
                Page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span> | Total:{" "}
                <span className="font-medium">{total}</span> products
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="text-sm text-gray-700 flex items-center gap-2">
                    <span>Per page:</span>
                    <select
                        value={limit}
                        onChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {optionValues.map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Pagination;