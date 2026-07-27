"use client";

import React, { useState } from 'react';
import { useComputedData } from '@/lib/data-computed';
import { SiteRecord } from '@/types';

const PAGE_SIZE = 25;

export function MasterSiteDetailsTable() {
  const { filteredData } = useComputedData();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const displayRows = search.trim()
    ? filteredData.filter(r => 
        r.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.srName.toLowerCase().includes(search.toLowerCase()) ||
        r.highLevelStatus.toLowerCase().includes(search.toLowerCase()) ||
        r.tcoBauVendor.toLowerCase().includes(search.toLowerCase()) ||
        r.cwStatus.toLowerCase().includes(search.toLowerCase())
      )
    : filteredData;

  const totalPages = Math.ceil(displayRows.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentData = displayRows.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-display font-bold text-dashboard-text tracking-wide uppercase">
            Site Details (Master Dataset)
          </h3>
          <p className="text-xs text-dashboard-muted">Full site level status, vendor allocations, and civil works stages</p>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="text"
            placeholder="Quick search sites..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-dashboard-bg border border-dashboard-border text-dashboard-text rounded px-3 py-1.5 text-xs w-64 focus:outline-none focus:border-dashboard-accent-blue"
          />
          <span className="text-xs px-2.5 py-0.5 rounded font-mono bg-dashboard-bg border border-dashboard-border text-dashboard-text">
            {displayRows.length} Sites
          </span>
        </div>
      </div>

      <div className="overflow-x-auto border border-dashboard-border rounded mb-4 custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-dashboard-bg border-b border-dashboard-border text-dashboard-muted uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">SN</th>
              <th className="py-2.5 px-3">SR Name</th>
              <th className="py-2.5 px-3">High Level Status</th>
              <th className="py-2.5 px-3">Target RFTI</th>
              <th className="py-2.5 px-3">TCO Vendor</th>
              <th className="py-2.5 px-3">CW Status Stage</th>
              <th className="py-2.5 px-3">TRS Vendor</th>
              <th className="py-2.5 px-3">TRS Status</th>
              <th className="py-2.5 px-3">TRS Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-border/40 font-mono">
            {currentData.map((r: SiteRecord, idx: number) => (
              <tr key={r.serialNumber || idx} className="hover:bg-white/5">
                <td className="py-2 px-3 text-dashboard-accent-blue font-semibold">{r.serialNumber}</td>
                <td className="py-2 px-3 text-dashboard-text font-sans max-w-xs truncate">{r.srName}</td>
                <td className="py-2 px-3">
                  <span className="px-2 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-300 border border-purple-500/20 font-sans">
                    {r.highLevelStatus}
                  </span>
                </td>
                <td className="py-2 px-3 text-dashboard-muted">{r.targetRfti || 'N/A'}</td>
                <td className="py-2 px-3 text-dashboard-text font-sans">{r.tcoBauVendor}</td>
                <td className="py-2 px-3 text-dashboard-text font-sans">{r.cwStatus}</td>
                <td className="py-2 px-3 text-dashboard-muted">{r.trsVendor}</td>
                <td className="py-2 px-3 text-dashboard-muted font-sans">{r.trsStatus}</td>
                <td className="py-2 px-3 text-dashboard-muted font-sans max-w-xs truncate">{r.trsRemarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-dashboard-muted">
        <span>Showing {startIndex + 1} – {Math.min(startIndex + PAGE_SIZE, displayRows.length)} of {displayRows.length}</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-dashboard-bg border border-dashboard-border rounded disabled:opacity-40 hover:bg-dashboard-card transition-colors"
          >
            ◄ Prev
          </button>
          <span className="px-2 font-mono">{currentPage} / {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-dashboard-bg border border-dashboard-border rounded disabled:opacity-40 hover:bg-dashboard-card transition-colors"
          >
            Next ►
          </button>
        </div>
      </div>
    </div>
  );
}
