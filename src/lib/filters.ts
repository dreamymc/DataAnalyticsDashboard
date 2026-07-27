import { SiteRecord, FilterState } from '@/types';

export function applyFilters(data: SiteRecord[], filters: FilterState): SiteRecord[] {
  if (!data || data.length === 0) return [];

  return data.filter(record => {
    if (filters.salesArea && record.salesArea !== filters.salesArea) return false;
    if (filters.province && record.province !== filters.province) return false;
    if (filters.town && record.cityTown !== filters.town) return false;
    if (filters.accessVendor && record.accessVendor !== filters.accessVendor) return false;
    if (filters.tco && record.tcoBauVendor !== filters.tco) return false;
    if (filters.solutionType && record.solutionType !== filters.solutionType) return false;
    if (filters.vanguardPrioSite && record.vanguardPrioSite !== filters.vanguardPrioSite) return false;

    return true;
  });
}
