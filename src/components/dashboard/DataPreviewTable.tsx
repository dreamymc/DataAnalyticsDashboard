"use client";

import React, { useState } from 'react';
import { useComputedData } from '@/lib/data-computed';
import { SiteRecord } from '@/types';

export function DataPreviewTable() {
  const { filteredData } = useComputedData();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportCsv = () => {
    if (filteredData.length === 0) return;

    const headers = [
      'Serial Number',
      'SR Name',
      'High Level Status',
      'Low Level Status',
      'Access Vendor',
      'TCO/BAU Vendor',
      'CW Status',
      'TRS Status',
      'Province',
      'City/Town',
      'Sales Area',
      'Vanguard/Prio Site',
      'Program',
      '263 List / PLAN',
      'Target Month (TRFS Plan)',
      'Actual Month (TRFS)',
      'Solution Type',
      'Q3 Sprint Target'
    ];

    const rows = filteredData.map(r => [
      r.serialNumber,
      r.srName,
      r.highLevelStatus,
      r.lowLevelStatus,
      r.accessVendor,
      r.tcoBauVendor,
      r.cwStatus,
      r.trsStatus,
      r.province,
      r.cityTown,
      r.salesArea,
      r.vanguardPrioSite,
      r.program,
      r.isInPlan ? 'Yes' : 'No',
      r.targetMonthTrfs || 'N/A',
      r.actualMonthTrfs || 'N/A',
      r.solutionType,
      r.q3SprintTarget ?? ''
    ]);

    const csvContent = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map(row => row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `t8-dashboard-export-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const searchedData = searchQuery.trim()
    ? filteredData.filter(r => 
        r.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.srName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.highLevelStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cityTown.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredData;

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg mb-6 overflow-hidden">
      {/* Toggle Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <span className="text-dashboard-accent-blue font-bold text-lg">
            {isOpen ? '▼' : '►'}
          </span>
          <h3 className="text-base font-display font-bold text-dashboard-text uppercase tracking-wide">
            Data Records Table & Export
          </h3>
          <span className="text-xs bg-dashboard-bg border border-dashboard-border text-dashboard-muted px-2.5 py-0.5 rounded-full font-mono">
            Showing {filteredData.length} records
          </span>
        </div>

        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleExportCsv}
            disabled={filteredData.length === 0}
            className="px-3.5 py-1.5 bg-dashboard-accent-green/20 text-dashboard-accent-green border border-dashboard-accent-green/40 hover:bg-dashboard-accent-green/30 text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            📥 Export CSV ({filteredData.length})
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 border-t border-dashboard-border space-y-4">
          <div className="flex items-center justify-between gap-4">
            <input 
              type="text"
              placeholder="Search serial number, site name, status, province..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dashboard-bg border border-dashboard-border text-dashboard-text rounded px-3 py-1.5 text-xs w-72 focus:outline-none focus:border-dashboard-accent-blue"
            />
            <span className="text-xs text-dashboard-muted">
              Displaying {searchedData.length} of {filteredData.length} filtered rows
            </span>
          </div>

          <div className="overflow-x-auto max-h-96 border border-dashboard-border rounded custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-dashboard-bg border-b border-dashboard-border text-dashboard-muted">
                <tr>
                  <th className="py-2.5 px-3">Serial No</th>
                  <th className="py-2.5 px-3">SR / Site Name</th>
                  <th className="py-2.5 px-3">High Level Status</th>
                  <th className="py-2.5 px-3">Province</th>
                  <th className="py-2.5 px-3">City / Town</th>
                  <th className="py-2.5 px-3">Access Vendor</th>
                  <th className="py-2.5 px-3">TCO / BAU Vendor</th>
                  <th className="py-2.5 px-3 text-center">In Plan?</th>
                  <th className="py-2.5 px-3 text-center">Target Month</th>
                  <th className="py-2.5 px-3 text-center">Actual Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashboard-border/40 font-mono">
                {searchedData.slice(0, 200).map((r: SiteRecord, idx: number) => (
                  <tr key={r.serialNumber || idx} className="hover:bg-white/5">
                    <td className="py-2 px-3 text-dashboard-accent-blue font-semibold">{r.serialNumber}</td>
                    <td className="py-2 px-3 text-dashboard-text truncate max-w-xs font-sans">{r.srName}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {r.highLevelStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-dashboard-muted">{r.province}</td>
                    <td className="py-2 px-3 text-dashboard-muted">{r.cityTown}</td>
                    <td className="py-2 px-3 text-dashboard-text">{r.accessVendor}</td>
                    <td className="py-2 px-3 text-dashboard-text">{r.tcoBauVendor}</td>
                    <td className="py-2 px-3 text-center font-semibold">{r.isInPlan ? '✓ Yes' : 'No'}</td>
                    <td className="py-2 px-3 text-center text-dashboard-muted">{r.targetMonthTrfs || 'N/A'}</td>
                    <td className="py-2 px-3 text-center text-dashboard-accent-purple font-semibold">{r.actualMonthTrfs || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {searchedData.length > 200 && (
              <div className="p-2 text-center text-xs text-dashboard-muted bg-dashboard-bg/50 border-t border-dashboard-border">
                Showing first 200 rows. Use Export CSV to view all {searchedData.length} records.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
