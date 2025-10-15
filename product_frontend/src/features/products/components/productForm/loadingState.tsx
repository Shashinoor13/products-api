import { Spinner } from "@/components/ui/spinner";

function LoadingState({ onCancel }: { onCancel: () => void }) {
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

export default LoadingState;