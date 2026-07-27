import { SiteRecord } from '@/types';
import { mapRowToSiteRecord, EXPECTED_HEADERS } from './excel-parser';
import * as XLSX from 'xlsx';

export async function fetchGoogleSheetCsv(url: string): Promise<SiteRecord[]> {
  if (!url.toLowerCase().includes('csv')) {
    throw new Error('URL must be a published CSV link');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`);
  }
  const text = await response.text();
  
  // Use XLSX to parse the CSV string
  const workbook = XLSX.read(text, { type: 'string' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  
  // Parse with headers mapped to array
  const rawRows: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
  
  if (rawRows.length === 0) return [];

  // For CSV, we assume the first row is headers
  const headers = rawRows[0];
  const dataRows = rawRows.slice(1);
  
  // Create a default column map
  const columnMap: Record<string, string> = {};
  const assignedExpected = new Set<string>();

  headers.forEach(h => {
    const headerStr = String(h).trim().toLowerCase();
    for (const expected of EXPECTED_HEADERS) {
      if (assignedExpected.has(expected)) continue;
      
      const e = expected.toLowerCase();
      if (
        headerStr === e || 
        headerStr.includes(e) || 
        e.includes(headerStr) ||
        (headerStr.includes('site') && e.includes('site')) ||
        (headerStr.includes('tco') && e.includes('tco')) ||
        (headerStr.includes('vendor') && e.includes('vendor')) ||
        (headerStr.includes('town') && e.includes('city')) ||
        (headerStr.includes('brgy') && e.includes('barangay'))
      ) {
        columnMap[h] = expected;
        assignedExpected.add(expected);
        break;
      }
    }
  });

  const parsedData: SiteRecord[] = [];
  for (const rowArr of dataRows) {
    if (!Array.isArray(rowArr)) continue;
    const rowObj: Record<string, any> = {};
    headers.forEach((h: string, i: number) => {
      if (h) rowObj[h] = rowArr[i];
    });

    const record = mapRowToSiteRecord(rowObj, columnMap);
    if (record) {
      parsedData.push(record);
    }
  }

  return parsedData;
}
