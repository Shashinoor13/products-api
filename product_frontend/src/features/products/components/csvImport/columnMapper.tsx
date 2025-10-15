interface CsvMappingSectionProps {
  headers: string[];
  fieldMapping: Record<string, string>;
  onMappingChange: (csvColumn: string, fieldName: string) => void;
}

const FIELD_MAPPING_OPTIONS = [
  { value: "", label: "-- Select Field --" },
  { value: "name", label: "Product Name" },
  { value: "description", label: "Description" },
  { value: "price", label: "Price" },
];

export default function CsvMappingSection({
  headers,
  fieldMapping,
  onMappingChange,
}: CsvMappingSectionProps) {
  if (headers.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Map CSV Columns to Product Fields</h3>
      <p className="text-sm text-gray-600 mb-3">
        All fields are required. Each CSV column must be mapped to a unique product field.
      </p>

      <div className="space-y-3">
        {headers.map((header) => (
          <div key={header} className="flex items-center gap-4">
            <div className="w-1/3">
              <span className="text-sm font-medium text-gray-700">{header}</span>
            </div>
            <div className="w-2/3">
              <select
                value={fieldMapping[header] || ""}
                onChange={(e) => onMappingChange(header, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                {FIELD_MAPPING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
