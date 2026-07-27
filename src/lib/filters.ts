import { SiteRecord, FilterState } from '@/types';

export function applyFilters(data: SiteRecord[], filters: FilterState): SiteRecord[] {
  return data.filter(record => {
    // Exact match for most filters
    if (filters.province && record.province !== filters.province) return false;
    if (filters.town && record.cityTown !== filters.town) return false;
    if (filters.accessVendor && record.vendor !== filters.accessVendor) return false;
    if (filters.tco && record.tcoBauVendor !== filters.tco) return false;
    if (filters.solutionType && record.program !== filters.solutionType) return false;
    
    // Placeholder filters (salesArea, vanguardPrioSite) are not applied to rawData 
    // since they aren't in the dataset, but if they were mapped, they would go here.
    return true;
  });
}
