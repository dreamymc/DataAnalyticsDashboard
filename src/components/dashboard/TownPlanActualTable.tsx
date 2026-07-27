"use client";

import React, { useState } from 'react';
import { useComputedData } from '@/lib/data-computed';

const PAGE_SIZE = 15;

export function TownPlanActualTable() {
  const { townBreakdownData } = useComputedData();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(townBreakdownData.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentData = townBreakdownData.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-display font-bold text-dashboard-text tracking-wide uppercase">
          Town Breakdown (Plan vs Actual)
        </h3>
        <span className="text-xs text-dashboard-muted font-mono">
          Page {currentPage} of {totalPages} ({townBreakdownData.length} Towns)
        </span>
      </div>

      <div className="overflow-x-auto border border-dashboard-border rounded mb-4">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-dashboard-bg border-b border-dashboard-border text-dashboard-muted uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">Town / City</th>
              <th className="py-2.5 px-3 text-center">Pipeline</th>
              <th className="py-2.5 px-3 text-center">PLAN (In-Year)</th>
              <th className="py-2.5 px-3 text-center">RTB</th>
              <th className="py-2.5 px-3 text-center">RFI</th>
              <th className="py-2.5 px-3 text-center font-bold text-dashboard-accent-purple">TRFS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-border/40 font-mono">
            {currentData.map(t => (
              <tr key={t.town} className="hover:bg-white/5">
                <td className="py-2 px-3 text-dashboard-text font-sans font-medium">{t.town}</td>
                <td className="py-2 px-3 text-center text-dashboard-muted">{t.pipeline}</td>
                <td className="py-2 px-3 text-center text-dashboard-accent-blue font-semibold">{t.plan}</td>
                <td className="py-2 px-3 text-center text-dashboard-text">{t.rtb}</td>
                <td className="py-2 px-3 text-center text-dashboard-text">{t.rfi}</td>
                <td className="py-2 px-3 text-center text-dashboard-accent-purple font-bold">{t.trfs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-dashboard-muted">
        <span>Showing {startIndex + 1} – {Math.min(startIndex + PAGE_SIZE, townBreakdownData.length)} of {townBreakdownData.length}</span>
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
