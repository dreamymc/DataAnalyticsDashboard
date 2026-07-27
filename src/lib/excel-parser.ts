import * as XLSX from 'xlsx';
import { SiteRecord } from '@/types';

export const EXPECTED_HEADERS = [
  'Serial Number',
  'Lead Indicator (LOCAL)',
  'Vendor',
  'Site/Barangay',
  'TCO/BAU Vendor',
  'Province',
  'City/Town',
  'Program'
];

export async function parseExcelFile(file: File): Promise<any[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of arrays, keeping empty cells
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// Maps raw row data (object based on headers) to our SiteRecord interface
export function mapRowToSiteRecord(row: any, columnMap: Record<string, string>): SiteRecord | null {
  if (!row || Object.keys(row).length === 0) return null;

  const getMappedValue = (expectedHeader: string) => {
    // Find which raw header maps to this expected header
    const rawHeader = Object.keys(columnMap).find(k => columnMap[k] === expectedHeader);
    if (!rawHeader) return '';
    return row[rawHeader] !== undefined && row[rawHeader] !== null ? String(row[rawHeader]).trim() : '';
  };

  const record: SiteRecord = {
    serialNumber: getMappedValue('Serial Number'),
    leadIndicator: getMappedValue('Lead Indicator (LOCAL)'),
    vendor: getMappedValue('Vendor'),
    siteBarangay: getMappedValue('Site/Barangay'),
    tcoBauVendor: getMappedValue('TCO/BAU Vendor'),
    province: getMappedValue('Province'),
    cityTown: getMappedValue('City/Town'),
    program: getMappedValue('Program'),
  };

  // Basic validation: skip empty rows
  if (!record.serialNumber && !record.siteBarangay && !record.leadIndicator) {
    return null;
  }

  return record;
}
