"use client";

import React, { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Dropdown } from '@/components/ui/Dropdown';

export function FilterPanel() {
  const { state, dispatch } = useDashboard();
  const { rawData, filters } = state;

  // Extract unique values
  const provinces = useMemo(() => Array.from(new Set(rawData.map(r => r.province).filter(Boolean))).sort(), [rawData]);
  
  // Town options depend on selected Province
  const towns = useMemo(() => {
    let filtered = rawData;
    if (filters.province) {
      filtered = filtered.filter(r => r.province === filters.province);
    }
    return Array.from(new Set(filtered.map(r => r.cityTown).filter(Boolean))).sort();
  }, [rawData, filters.province]);
  
  const accessVendors = useMemo(() => Array.from(new Set(rawData.map(r => r.vendor).filter(Boolean))).sort(), [rawData]);
  const tcos = useMemo(() => Array.from(new Set(rawData.map(r => r.tcoBauVendor).filter(Boolean))).sort(), [rawData]);
  const solutionTypes = useMemo(() => Array.from(new Set(rawData.map(r => r.program).filter(Boolean))).sort(), [rawData]);

  const salesAreas = ["North", "South", "East", "West"]; // Placeholder
  const vanguardPrioSites = ["Yes", "No"]; // Placeholder

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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
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
          label="Town" 
          value={filters.town} 
          options={towns} 
          onChange={(v) => handleFilterChange('town', v)} 
        />
        <Dropdown 
          label="Access Vendor" 
          value={filters.accessVendor} 
          options={accessVendors} 
          onChange={(v) => handleFilterChange('accessVendor', v)} 
        />
        <Dropdown 
          label="TCO" 
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
          options={vanguardPrioSites} 
          onChange={(v) => handleFilterChange('vanguardPrioSite', v)} 
        />
      </div>
      
      <div className="mt-4 pt-4 border-t border-dashboard-border shrink-0">
        <button 
          onClick={handleClearFilters}
          className="w-full py-2 bg-dashboard-bg border border-dashboard-border rounded text-dashboard-text font-medium hover:bg-dashboard-card transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
