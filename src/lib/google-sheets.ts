import { SiteRecord } from '@/types';
import { mapRowToSiteRecord } from './excel-parser';
import { detectHeaderRowIndex, autoMapHeaders } from './header-detector';
import * as XLSX from 'xlsx';

export async function fetchGoogleSheetCsv(url: string): Promise<SiteRecord[]> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    throw new Error('Please enter a valid Google Sheets CSV URL');
  }

  const response = await fetch(cleanUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText} (${response.status})`);
  }
  const text = await response.text();
  
  const workbook = XLSX.read(text, { type: 'string' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  
  const rawRows: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
  if (rawRows.length === 0) return [];

  const headerIdx = detectHeaderRowIndex(rawRows);
  const headerRow = rawRows[headerIdx] || [];
  const dataRows = rawRows.slice(headerIdx + 1);
  
  const stringHeaders = headerRow.map(h => String(h || '').trim());
  const columnMap = autoMapHeaders(stringHeaders);

  const parsedData: SiteRecord[] = [];
  for (const rowArr of dataRows) {
    if (!Array.isArray(rowArr) || rowArr.every(c => c === '' || c === null)) continue;
    
    const rowObj: Record<string, any> = {};
    stringHeaders.forEach((h: string, i: number) => {
      if (h) rowObj[h] = rowArr[i];
    });

    const record = mapRowToSiteRecord(rowObj, columnMap);
    if (record) {
      parsedData.push(record);
    }
  }

  return parsedData;
}
