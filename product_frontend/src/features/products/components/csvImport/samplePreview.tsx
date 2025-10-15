type CsvRow = Record<string, string>;

interface CsvPreviewTableProps {
  data: CsvRow[];
  headers: string[];
}

export default function CsvPreviewTable({ data, headers }: CsvPreviewTableProps) {
  if (data.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Preview (First 5 rows)</h3>
      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(0, 5).map((row, idx) => (
              <tr key={idx}>
                {headers.map((header) => (
                  <td key={header} className="px-4 py-2 text-sm text-gray-900">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
