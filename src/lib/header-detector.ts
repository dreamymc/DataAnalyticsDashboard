import { EXPECTED_HEADERS } from './excel-parser';

export function detectHeaderRowIndex(rows: any[][]): number {
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i];
    if (!row || !Array.isArray(row)) continue;
    
    // Count cells that contain actual non-numeric text
    const nonNumericCount = row.filter(cell => {
      if (cell === null || cell === undefined) return false;
      const str = String(cell).trim();
      return str.length > 0 && isNaN(Number(str));
    }).length;
    
    // Count total non-empty cells
    const nonEmptyCount = row.filter(cell => {
      if (cell === null || cell === undefined) return false;
      return String(cell).trim().length > 0;
    }).length;
    
    // Header row heuristic: at least 50% non-empty non-numeric cells
    if (nonEmptyCount >= 5 && nonNumericCount >= nonEmptyCount * 0.5) {
      return i;
    }
  }
  return 0; // fallback to first row
}

export function isBrokenHeader(header: string): boolean {
  if (!header) return false;
  // If header looks like a site name (e.g. Brgy..., NS-...), mark as suspect
  const patterns = [/^Brgy/i, /^NS-/i, /Cotabato/i, /Holcim/i];
  return patterns.some(p => p.test(String(header).trim()));
}

export const HEADER_ALIASES: Record<string, string[]> = {
  'Serial Number': ['Serial Number', 'Serial No', 'ID', 'Site ID', 'Serial'],
  'SR Name': ['SR Name', 'Site Name', 'Barangay', 'SR', 'Site Description'],
  'High Level Status': ['High Level Status', 'Lead Indicator', 'Stage', 'Status'],
  'Low Level Status': ['Low Level Status', 'Sub Status', 'Detail Status'],
  'Access Vendor': ['Access Vendor', 'Vendor', 'Supplier', 'Access'],
  'TCO/BAU Vendor': ['TCO/BAU Vendor', 'TCO Vendor', 'BAU Vendor', 'TCO'],
  'CW Status': ['CW Status', 'Civil Works Status', 'CW Stage'],
  'TRS Vendor': ['TRS Vendor'],
  'TRS Status': ['TRS Status', 'TRS Stage'],
  "TRS Sol'n": ["TRS Sol'n", 'TRS Solution', 'Soln'],
  'Target RFTI': ['Target RFTI', 'RFTI Plan'],
  'Actual RFTI': ['Actual RFTI', 'RFTI Actual'],
  'Lapse (days)': ['Lapse (days)', 'Lapse', 'Delay Days'],
  'TRS Plan': ['TRS Plan'],
  'TRS Actual': ['TRS Actual'],
  'ODC': ['ODC'],
  'Province': ['Province', 'Region'],
  'City/Town': ['City/Town', 'Town', 'City', 'Municipality'],
  'Sales Area': ['Sales Area', 'Area', 'Sales Region'],
  'Vanguard/Prio Site': ['Vanguard/Prio Site', 'Vanguard', 'Priority', 'Prio Site'],
  'Program': ['Program', 'Project'],
  '263 List / PLAN (In-Year)': ['263 List / PLAN (In-Year)', '263 List', 'PLAN', 'Plan (In-Year)', '263 Plan'],
  'Target Month (TRFS Plan)': ['Target Month (TRFS Plan)', 'Target Month', 'Plan Month'],
  'Target Quarter (TRFS Plan)': ['Target Quarter (TRFS Plan)', 'Target Quarter', 'Plan Quarter'],
  'Actual Month (TRFS)': ['Actual Month (TRFS)', 'Actual Month', 'TRFS Month'],
  'Actual Quarter (TRFS)': ['Actual Quarter (TRFS)', 'Actual Quarter', 'TRFS Quarter'],
  'Detailed Status': ['Detailed Status'],
  'Integration Remarks': ['Integration Remarks'],
  'TRS Remarks': ['TRS Remarks'],
  'Latitude': ['Latitude', 'Lat'],
  'Longitude': ['Longitude', 'Lng', 'Long'],
  'Solution Type': ['Solution Type', 'Sol Type'],
  'Q3 Sprint Target': ['Q3 Sprint Target', 'Q3 Sprint', 'Sprint Target'],
};

export function autoMapHeaders(detectedHeaders: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const rawHeader of detectedHeaders) {
    if (!rawHeader) continue;
    const cleanRaw = String(rawHeader).trim();
    
    // Direct exact match first
    const exact = EXPECTED_HEADERS.find(h => h.toLowerCase() === cleanRaw.toLowerCase());
    if (exact) {
      map[cleanRaw] = exact;
      continue;
    }
    
    // Fuzzy alias match
    let matched = false;
    for (const [expectedHeader, aliases] of Object.entries(HEADER_ALIASES)) {
      if (aliases.some(a => a.toLowerCase() === cleanRaw.toLowerCase())) {
        map[cleanRaw] = expectedHeader;
        matched = true;
        break;
      }
    }
    if (!matched) {
      map[cleanRaw] = ''; // Unmapped
    }
  }
  return map;
}
