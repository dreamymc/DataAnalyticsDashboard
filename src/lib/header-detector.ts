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
    
    // Header row: most non-empty cells are non-numeric text
    // Check if at least 50% of the non-empty cells are text
    if (nonEmptyCount > 0 && nonNumericCount >= nonEmptyCount * 0.5) {
      return i;
    }
  }
  return 0; // fallback to first row
}

export function isBrokenHeader(header: string): boolean {
  if (!header) return false;
  const patterns = [/Brgy/i, /_/i, /Davao/i, /City/i, /Province/i];
  return patterns.some(p => p.test(String(header)));
}
