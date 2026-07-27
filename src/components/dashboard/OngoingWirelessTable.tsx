"use client";

import React, { useState } from 'react';
import { useComputedData } from '@/lib/data-computed';
import { SiteRecord } from '@/types';

const PAGE_SIZE = 10;

export function OngoingWirelessTable() {
  const { ongoingWirelessData } = useComputedData();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ongoingWirelessData.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentData = ongoingWirelessData.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-display font-bold text-dashboard-text tracking-wide uppercase">
            Ongoing Wireless Integration (TRS Ready)
          </h3>
          <p className="text-xs text-dashboard-muted">Sites at TRS Ready stage pending wireless integration</p>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
          {ongoingWirelessData.length} Sites
        </span>
      </div>

      <div className="overflow-x-auto border border-dashboard-border rounded mb-4">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-dashboard-bg border-b border-dashboard-border text-dashboard-muted uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">SN</th>
              <th className="py-2.5 px-3">SR Name</th>
              <th className="py-2.5 px-3">TCO</th>
              <th className="py-2.5 px-3">TRS Sol'n</th>
              <th className="py-2.5 px-3">TRS Vendor</th>
              <th className="py-2.5 px-3">TRS Actual</th>
              <th className="py-2.5 px-3">Integration Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-border/40 font-mono">
            {currentData.map((r: SiteRecord, idx: number) => (
              <tr key={r.serialNumber || idx} className="hover:bg-white/5">
                <td className="py-2 px-3 text-dashboard-accent-blue font-semibold">{r.serialNumber}</td>
                <td className="py-2 px-3 text-dashboard-text font-sans max-w-xs truncate">{r.srName}</td>
                <td className="py-2 px-3 text-dashboard-text">{r.tcoBauVendor}</td>
                <td className="py-2 px-3 text-dashboard-muted">{r.trsSolution}</td>
                <td className="py-2 px-3 text-dashboard-muted">{r.trsVendor}</td>
                <td className="py-2 px-3 text-dashboard-accent-purple font-semibold">{r.trsActual || 'N/A'}</td>
                <td className="py-2 px-3 text-dashboard-muted font-sans max-w-xs truncate">{r.integrationRemarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-dashboard-muted">
        <span>Showing {startIndex + 1} – {Math.min(startIndex + PAGE_SIZE, ongoingWirelessData.length)} of {ongoingWirelessData.length}</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-dashboard-bg border border-dashboard-border rounded disabled:opacity-40 hover:bg-dashboard-card transition-colors"
          >
            ◄ Prev
          </button>
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
