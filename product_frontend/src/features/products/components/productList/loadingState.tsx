import { Spinner } from "@/components/ui/spinner";


const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="space-y-4 text-center">
        <Spinner />
      <p className="text-gray-600">Loading products...</p>
    </div>
  </div>
);

export default LoadingState;