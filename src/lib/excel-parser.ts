import * as XLSX from 'xlsx';
import { SiteRecord } from '@/types';

export const EXPECTED_HEADERS = [
  'Serial Number',
  'SR Name',
  'High Level Status',
  'Low Level Status',
  'Access Vendor',
  'TCO/BAU Vendor',
  'CW Status',
  'TRS Vendor',
  'TRS Status',
  "TRS Sol'n",
  'Target RFTI',
  'Actual RFTI',
  'Lapse (days)',
  'TRS Plan',
  'TRS Actual',
  'ODC',
  'Province',
  'City/Town',
  'Sales Area',
  'Vanguard/Prio Site',
  'Program',
  '263 List / PLAN (In-Year)',
  'Target Month (TRFS Plan)',
  'Target Quarter (TRFS Plan)',
  'Actual Month (TRFS)',
  'Actual Quarter (TRFS)',
  'Detailed Status',
  'Integration Remarks',
  'TRS Remarks',
  'Latitude',
  'Longitude',
  'Solution Type',
  'Q3 Sprint Target'
];

export async function parseExcelFile(file: File): Promise<any[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
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

export function mapRowToSiteRecord(row: any, columnMap: Record<string, string>): SiteRecord | null {
  if (!row || Object.keys(row).length === 0) return null;

  const getVal = (expectedHeader: string): string => {
    const rawHeader = Object.keys(columnMap).find(k => columnMap[k] === expectedHeader);
    if (!rawHeader) return '';
    const v = row[rawHeader];
    if (v === undefined || v === null) return '';
    return String(v).trim();
  };

  const getNullableVal = (expectedHeader: string): string | null => {
    const val = getVal(expectedHeader);
    if (!val || val.toUpperCase() === 'N/A' || val.toUpperCase() === 'NONE' || val.toUpperCase() === 'NULL') {
      return null;
    }
    return val;
  };

  const getNumVal = (expectedHeader: string): number | null => {
    const val = getVal(expectedHeader);
    if (!val || val.toUpperCase() === 'N/A') return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  };

  const serialNumber = getVal('Serial Number');
  const srName = getVal('SR Name');
  const highLevelStatus = getVal('High Level Status');

  // Skip completely empty rows or invalid rows
  if (!serialNumber && !srName && !highLevelStatus) {
    return null;
  }

  const planVal = getVal('263 List / PLAN (In-Year)');
  const isInPlan = planVal.toUpperCase() === 'YES';

  return {
    serialNumber,
    srName,
    highLevelStatus,
    lowLevelStatus: getVal('Low Level Status'),
    accessVendor: getVal('Access Vendor'),
    tcoBauVendor: getVal('TCO/BAU Vendor'),
    cwStatus: getVal('CW Status'),
    trsVendor: getVal('TRS Vendor'),
    trsStatus: getVal('TRS Status'),
    trsSolution: getVal("TRS Sol'n"),
    targetRfti: getNullableVal('Target RFTI'),
    actualRfti: getNullableVal('Actual RFTI'),
    lapseDays: getNumVal('Lapse (days)'),
    trsPlan: getNullableVal('TRS Plan'),
    trsActual: getNullableVal('TRS Actual'),
    odc: getNullableVal('ODC'),
    province: getVal('Province'),
    cityTown: getVal('City/Town'),
    salesArea: getVal('Sales Area'),
    vanguardPrioSite: getVal('Vanguard/Prio Site') || 'N',
    program: getVal('Program'),
    isInPlan,
    targetMonthTrfs: getNullableVal('Target Month (TRFS Plan)'),
    targetQuarterTrfs: getNullableVal('Target Quarter (TRFS Plan)'),
    actualMonthTrfs: getNullableVal('Actual Month (TRFS)'),
    actualQuarterTrfs: getNullableVal('Actual Quarter (TRFS)'),
    detailedStatus: getVal('Detailed Status'),
    integrationRemarks: getVal('Integration Remarks'),
    trsRemarks: getVal('TRS Remarks'),
    latitude: getNumVal('Latitude'),
    longitude: getNumVal('Longitude'),
    solutionType: getVal('Solution Type'),
    q3SprintTarget: getNumVal('Q3 Sprint Target'),
  };
}
