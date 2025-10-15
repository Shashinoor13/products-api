import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

export default function CsvSampleDownload() {
  const [error, setError] = useState<string | null>(null);

  const handleDownloadSample = async () => {
    try {
      const response = await fetch("/sample/data.csv");
      if (!response.ok) throw new Error("Failed to fetch sample CSV");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sample_products.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download sample CSV. Please check your connection.");
      console.error("Error downloading sample:", err);
    }
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <p className="text-sm text-blue-800 mb-2">
        Need a template? Download our sample CSV file to see the expected format.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownloadSample}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download Sample CSV
      </Button>
    </div>
  );
}
