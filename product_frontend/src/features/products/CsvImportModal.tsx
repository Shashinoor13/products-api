import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CreateProductDto } from "@/daos/product.daos";
import CsvSampleDownload from "./components/csvImport/sampleDownload";
import CsvFileUpload from "./components/csvImport/fileUpload";
import CsvMappingSection from "./components/csvImport/columnMapper";
import CsvPreviewTable from "./components/csvImport/samplePreview";

type CsvRow = Record<string, string>;

interface CsvImportModalProps {
  onSubmit: (products: CreateProductDto[]) => Promise<void>;
  onCancel: () => void;
}

export default function CsvImportModal({ onSubmit, onCancel }: CsvImportModalProps) {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDataLoaded = (data: CsvRow[], headers: string[]) => {
    setCsvData(data);
    setCsvHeaders(headers);
  };

  const handleMappingChange = (csvColumn: string, fieldName: string) => {
    setFieldMapping((prev) => ({
      ...prev,
      [csvColumn]: fieldName,
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    // Validation & transformation logic (same as before)
    const required = ["name", "price", "description"];
    for (const field of required) {
      if (!Object.values(fieldMapping).includes(field)) {
        setError(`Please map a column to '${field}'`);
        return;
      }
    }

    const mappedFields = Object.values(fieldMapping).filter(f => f !== "");
    const uniqueFields = new Set(mappedFields);
    if (mappedFields.length !== uniqueFields.size) {
      setError("Each field can only be mapped once.");
      return;
    }

    const products: CreateProductDto[] = [];
    for (const row of csvData) {
      const product: Partial<CreateProductDto> = {};
      for (const [csvColumn, fieldName] of Object.entries(fieldMapping)) {
        const value = row[csvColumn];
        if (fieldName === "name") product.name = value.trim();
        else if (fieldName === "description") product.description = value?.trim() || "";
        else if (fieldName === "price") {
          const price = parseFloat(value);
          if (isNaN(price)) {
            setError(`Invalid price value: "${value}"`);
            return;
          }
          product.price = price;
        }
      }
      if (!product.name || product.price === undefined) {
        setError("Missing required fields in some rows");
        return;
      }
      products.push(product as CreateProductDto);
    }

    setIsSubmitting(true);
    try {
      await onSubmit(products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import products");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex justify-end"
      onClick={onCancel}
    >
      <div
        className="bg-white w-full max-w-3xl h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Import Products from CSV</h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <CsvSampleDownload />
          <CsvFileUpload onDataLoaded={handleDataLoaded} />
          <CsvMappingSection
            headers={csvHeaders}
            fieldMapping={fieldMapping}
            onMappingChange={handleMappingChange}
          />
          <CsvPreviewTable data={csvData} headers={csvHeaders} />

          <div className="sticky bottom-0 bg-white pt-6 pb-2 border-t mt-8 -mx-8 px-8">
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || csvData.length === 0}
              >
                {isSubmitting ? "Importing..." : `Import ${csvData.length} Products`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
