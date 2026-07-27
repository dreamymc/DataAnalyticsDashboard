"use client";

import React, { useState } from 'react';
import { EXPECTED_HEADERS } from '@/lib/excel-parser';
import { autoMapHeaders } from '@/lib/header-detector';

interface Props {
  previewData: any[][];
  headerRowIndex: number;
  onConfirm: (columnMap: Record<string, string>) => void;
  onCancel: () => void;
}

export function HeaderDetector({ previewData, headerRowIndex, onConfirm, onCancel }: Props) {
  const rawHeaders = (previewData[headerRowIndex] || []).map(h => String(h || '').trim());
  const dataRows = previewData.slice(headerRowIndex + 1, headerRowIndex + 4);

  const [columnMap, setColumnMap] = useState<Record<string, string>>(() => {
    return autoMapHeaders(rawHeaders);
  });

  const handleMapChange = (rawHeader: string, expectedHeader: string) => {
    setColumnMap(prev => ({
      ...prev,
      [rawHeader]: expectedHeader
    }));
  };

  const mappedCount = Object.values(columnMap).filter(Boolean).length;

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-6 w-full max-w-5xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-dashboard-text">Confirm Column Mapping</h2>
          <p className="text-sm text-dashboard-muted">
            Header detected at Row {headerRowIndex + 1}. Mapped {mappedCount} of {rawHeaders.filter(Boolean).length} columns.
          </p>
        </div>
        <div className="text-xs px-3 py-1 bg-dashboard-border/50 text-dashboard-text rounded font-mono">
          Total rows: {previewData.length - headerRowIndex - 1}
        </div>
      </div>

      <div className="overflow-x-auto max-h-[60vh] border border-dashboard-border rounded mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-dashboard-card border-b border-dashboard-border">
            <tr>
              <th className="py-3 px-4 text-xs uppercase tracking-wider font-semibold text-dashboard-muted">Detected Column</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider font-semibold text-dashboard-muted">Map To Field</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider font-semibold text-dashboard-muted">Sample Row Values</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-border/50">
            {rawHeaders.map((header: string, idx: number) => {
              if (!header) return null;
              const isMapped = Boolean(columnMap[header]);
              return (
                <tr key={idx} className={`hover:bg-white/5 ${isMapped ? '' : 'bg-red-500/5'}`}>
                  <td className="py-2.5 px-4 text-sm font-medium text-dashboard-text">
                    {header}
                  </td>
                  <td className="py-2.5 px-4">
                    <select 
                      className={`bg-dashboard-bg border rounded px-3 py-1.5 text-sm w-full focus:outline-none transition-colors ${
                        isMapped 
                          ? 'border-dashboard-border text-dashboard-text focus:border-dashboard-accent-blue' 
                          : 'border-yellow-500/50 text-yellow-300 focus:border-yellow-400'
                      }`}
                      value={columnMap[header] || ''}
                      onChange={(e) => handleMapChange(header, e.target.value)}
                    >
                      <option value="">-- Skip / Ignore --</option>
                      {EXPECTED_HEADERS.map(eh => (
                        <option key={eh} value={eh}>{eh}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-4 text-xs text-dashboard-muted truncate max-w-sm">
                    {dataRows.map(r => r[idx]).filter(c => c !== undefined && c !== null && c !== '').join(', ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3">
        <button 
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded font-medium text-dashboard-text hover:bg-dashboard-border transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => onConfirm(columnMap)}
          className="px-5 py-2 text-sm rounded font-medium bg-dashboard-accent-blue text-white hover:bg-blue-600 transition-colors shadow-lg shadow-dashboard-accent-blue/20"
        >
          Confirm & Import Data ({mappedCount} columns mapped)
        </button>
      </div>
    </div>
  );
}
