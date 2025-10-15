import { Upload } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";

type CsvRow = Record<string, string>;

interface CsvFileUploadProps {
  onDataLoaded: (data: CsvRow[], headers: string[]) => void;
}

export default function CsvFileUpload({ onDataLoaded }: CsvFileUploadProps) {
  const [rowsLoaded, setRowsLoaded] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError("CSV file is empty");
          return;
        }

        const data = results.data as CsvRow[];
        const headers = Object.keys(data[0] || {});
        setRowsLoaded(data.length);
        onDataLoaded(data, headers);
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Upload CSV File <span className="text-red-500">*</span>
      </label>

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
          <Upload className="h-4 w-4" />
          <span>Choose File</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        {rowsLoaded > 0 && (
          <span className="text-sm text-gray-600">{rowsLoaded} rows loaded</span>
        )}
      </div>
    </div>
  );
}
