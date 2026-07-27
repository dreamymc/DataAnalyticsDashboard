"use client";

import React, { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Dropdown } from '@/components/ui/Dropdown';

export function FilterPanel() {
  const { state, dispatch } = useDashboard();
  const { rawData, filters } = state;

  const salesAreas = useMemo(
    () => Array.from(new Set(rawData.map(r => r.salesArea).filter(Boolean))).sort(),
    [rawData]
  );

  const provinces = useMemo(
    () => Array.from(new Set(rawData.map(r => r.province).filter(Boolean))).sort(),
    [rawData]
  );

  const towns = useMemo(() => {
    let filtered = rawData;
    if (filters.province) {
      filtered = filtered.filter(r => r.province === filters.province);
    }
    return Array.from(new Set(filtered.map(r => r.cityTown).filter(Boolean))).sort();
  }, [rawData, filters.province]);

  const accessVendors = useMemo(
    () => Array.from(new Set(rawData.map(r => r.accessVendor).filter(Boolean))).sort(),
    [rawData]
  );

  const tcos = useMemo(
    () => Array.from(new Set(rawData.map(r => r.tcoBauVendor).filter(Boolean))).sort(),
    [rawData]
  );

  const solutionTypes = useMemo(
    () => Array.from(new Set(rawData.map(r => r.solutionType).filter(Boolean))).sort(),
    [rawData]
  );

  const vanguardPrioSites = useMemo(
    () => Array.from(new Set(rawData.map(r => r.vanguardPrioSite).filter(Boolean))).sort(),
    [rawData]
  );

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
    
    // Auto-clear town if province changes
    if (key === 'province') {
      dispatch({ type: 'SET_FILTER', payload: { key: 'town', value: '' } });
    }
  };

  const handleClearFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  return (
    <div className="flex flex-col h-full bg-dashboard-card border-r border-dashboard-border p-4">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-dashboard-border">
        <h2 className="text-base font-display font-bold uppercase tracking-wider text-dashboard-text">
          Filters
        </h2>
        {activeFilterCount > 0 && (
          <span className="bg-dashboard-accent-purple text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
            {activeFilterCount} Active
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
        <Dropdown 
          label="Sales Area" 
          value={filters.salesArea} 
          options={salesAreas} 
          onChange={(v) => handleFilterChange('salesArea', v)} 
        />
        <Dropdown 
          label="Province" 
          value={filters.province} 
          options={provinces} 
          onChange={(v) => handleFilterChange('province', v)} 
        />
        <Dropdown 
          label="City / Town" 
          value={filters.town} 
          options={towns} 
          onChange={(v) => handleFilterChange('town', v)} 
          disabled={provinces.length === 0}
        />
        <Dropdown 
          label="Access Vendor" 
          value={filters.accessVendor} 
          options={accessVendors} 
          onChange={(v) => handleFilterChange('accessVendor', v)} 
        />
        <Dropdown 
          label="TCO / BAU Vendor" 
          value={filters.tco} 
          options={tcos} 
          onChange={(v) => handleFilterChange('tco', v)} 
        />
        <Dropdown 
          label="Solution Type" 
          value={filters.solutionType} 
          options={solutionTypes} 
          onChange={(v) => handleFilterChange('solutionType', v)} 
        />
        <Dropdown 
          label="Vanguard / Prio Site" 
          value={filters.vanguardPrioSite} 
          options={vanguardPrioSites.length > 0 ? vanguardPrioSites : ['Y', 'N']} 
          onChange={(v) => handleFilterChange('vanguardPrioSite', v)} 
        />
      </div>
      
      <div className="mt-4 pt-4 border-t border-dashboard-border shrink-0">
        <button 
          onClick={handleClearFilters}
          disabled={activeFilterCount === 0}
          className={`w-full py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeFilterCount > 0
              ? 'bg-dashboard-bg border border-dashboard-border text-dashboard-text hover:bg-dashboard-border hover:text-white'
              : 'bg-dashboard-bg/50 border border-dashboard-border/30 text-dashboard-muted cursor-not-allowed'
          }`}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
