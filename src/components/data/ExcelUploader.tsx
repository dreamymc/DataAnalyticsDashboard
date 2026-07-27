"use client";

import React, { useState, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { parseExcelFile, mapRowToSiteRecord } from '@/lib/excel-parser';
import { detectHeaderRowIndex } from '@/lib/header-detector';
import { HeaderDetector } from './HeaderDetector';
import { SiteRecord } from '@/types';

export function ExcelUploader() {
  const { state, dispatch } = useDashboard();
  const [parsing, setParsing] = useState(false);
  const [rawJson, setRawJson] = useState<any[][] | null>(null);
  const [headerIndex, setHeaderIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    setErrorMsg(null);
    try {
      const data = await parseExcelFile(file);
      if (data.length === 0) {
        throw new Error("The Excel file appears to be empty.");
      }
      
      const hIndex = detectHeaderRowIndex(data);
      setHeaderIndex(hIndex);
      setRawJson(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to parse Excel file.");
    } finally {
      setParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmMapping = (columnMap: Record<string, string>) => {
    if (!rawJson) return;

    const rawHeaders = rawJson[headerIndex] || [];
    const dataRows = rawJson.slice(headerIndex + 1);

    const parsedData: SiteRecord[] = [];
    
    for (const rowArr of dataRows) {
      if (!Array.isArray(rowArr)) continue;
      
      const rowObj: Record<string, any> = {};
      rawHeaders.forEach((h: string, i: number) => {
        if (h) rowObj[h] = rowArr[i];
      });

      const record = mapRowToSiteRecord(rowObj, columnMap);
      if (record) {
        parsedData.push(record);
      }
    }

    dispatch({
      type: 'SET_DATA',
      payload: { source: 'excel', data: parsedData }
    });
    
    setRawJson(null);
  };

  const handleCancel = () => {
    setRawJson(null);
    setErrorMsg(null);
  };

  if (rawJson) {
    return (
      <HeaderDetector 
        previewData={rawJson}
        headerRowIndex={headerIndex}
        onConfirm={handleConfirmMapping}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-6">
      <h2 className="text-lg font-display font-bold mb-4">Upload Excel Data</h2>
      
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-4 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className={`
          flex items-center justify-center px-4 py-2 rounded font-medium cursor-pointer transition-colors
          ${parsing ? 'bg-dashboard-border text-dashboard-muted' : 'bg-dashboard-accent-purple text-white hover:bg-purple-600 shadow-lg shadow-dashboard-accent-purple/20'}
        `}>
          {parsing ? 'Parsing...' : 'Select Excel File'}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".xlsx,.xls,.csv" 
            onChange={handleFileChange}
            disabled={parsing}
          />
        </label>
        
        {state.dataSource === 'excel' && state.rawData.length > 0 && (
          <div className="text-sm text-green-400">
            ✓ Loaded {state.rawData.length} records
          </div>
        )}
      </div>
    </div>
  );
}
