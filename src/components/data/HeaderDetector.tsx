import React, { useState } from 'react';
import { EXPECTED_HEADERS } from '@/lib/excel-parser';

interface Props {
  previewData: any[][]; // array of arrays
  headerRowIndex: number;
  onConfirm: (columnMap: Record<string, string>) => void;
  onCancel: () => void;
}

export function HeaderDetector({ previewData, headerRowIndex, onConfirm, onCancel }: Props) {
  const rawHeaders = previewData[headerRowIndex] || [];
  
  // Data rows to show in preview
  const dataRows = previewData.slice(headerRowIndex + 1, headerRowIndex + 4);

  const [columnMap, setColumnMap] = useState<Record<string, string>>(() => {
    const initialMap: Record<string, string> = {};
    const assignedExpected = new Set<string>();

    rawHeaders.forEach(header => {
      const h = String(header).trim().toLowerCase();
      if (!h) return;

      for (const expected of EXPECTED_HEADERS) {
        if (assignedExpected.has(expected)) continue;

        const e = expected.toLowerCase();
        const matches = 
          h === e || 
          h.includes(e) || 
          e.includes(h) || 
          (h.includes('site') && e.includes('site')) ||
          (h.includes('tco') && e.includes('tco')) ||
          (h.includes('vendor') && e.includes('vendor')) ||
          (h.includes('town') && e.includes('city')) ||
          (h.includes('brgy') && e.includes('barangay'));

        if (matches) {
          initialMap[header] = expected;
          assignedExpected.add(expected);
          break;
        }
      }
    });
    return initialMap;
  });

  const handleMapChange = (rawHeader: string, expectedHeader: string) => {
    setColumnMap(prev => {
      const newMap = { ...prev };
      if (expectedHeader === '') {
        delete newMap[rawHeader];
      } else {
        newMap[rawHeader] = expectedHeader;
      }
      return newMap;
    });
  };

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-display font-bold mb-4">Confirm Column Mapping</h2>
      <p className="text-dashboard-muted mb-6">
        We detected the following headers in your file (Row {headerRowIndex + 1}). 
        Please map them to the expected dashboard fields.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-dashboard-border">
              <th className="py-3 px-4 font-semibold text-dashboard-text">Detected Column</th>
              <th className="py-3 px-4 font-semibold text-dashboard-text">Map To</th>
              <th className="py-3 px-4 font-semibold text-dashboard-muted">Sample Data</th>
            </tr>
          </thead>
          <tbody>
            {rawHeaders.map((header: string, idx: number) => {
              if (!String(header).trim()) return null;
              return (
                <tr key={idx} className="border-b border-dashboard-border/50 hover:bg-white/5">
                  <td className="py-3 px-4 text-dashboard-text font-medium">{String(header)}</td>
                  <td className="py-3 px-4">
                    <select 
                      className="bg-dashboard-bg border border-dashboard-border rounded px-3 py-1.5 text-dashboard-text w-full focus:outline-none focus:border-dashboard-accent-blue"
                      value={columnMap[header] || ''}
                      onChange={(e) => handleMapChange(header, e.target.value)}
                    >
                      <option value="">-- Skip / Ignore --</option>
                      {EXPECTED_HEADERS.map(eh => (
                        <option key={eh} value={eh}>{eh}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-dashboard-muted text-sm truncate max-w-xs">
                    {dataRows.map(r => r[idx]).filter(Boolean).join(', ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          onClick={onCancel}
          className="px-4 py-2 rounded font-medium text-dashboard-text hover:bg-dashboard-border transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => onConfirm(columnMap)}
          className="px-4 py-2 rounded font-medium bg-dashboard-accent-blue text-white hover:bg-blue-600 transition-colors shadow-lg shadow-dashboard-accent-blue/20"
        >
          Confirm & Import
        </button>
      </div>
    </div>
  );
}
