"use client";

import React from 'react';
import { useComputedData } from '@/lib/data-computed';

export function QuarterlyPlanTable() {
  const { quarterlyData } = useComputedData();

  const totalPlan = quarterlyData.reduce((acc, q) => acc + q.plan, 0);
  const totalActual = quarterlyData.reduce((acc, q) => acc + q.actual, 0);
  const totalPct = totalPlan > 0 ? ((totalActual / totalPlan) * 100).toFixed(1) + '%' : '0.0%';

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-display font-bold text-dashboard-text tracking-wide uppercase">
          Quarterly TRFS Plan vs Actual
        </h3>
        <span className="text-xs text-dashboard-muted font-mono">
          Total Plan: {totalPlan} | Total Actual: {totalActual} ({totalPct})
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-dashboard-border text-xs uppercase tracking-wider text-dashboard-muted">
              <th className="py-2.5 px-3">Metric</th>
              {quarterlyData.map(q => (
                <th key={q.quarter} className="py-2.5 px-3 text-center">{q.quarter}</th>
              ))}
              <th className="py-2.5 px-3 text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-border/50">
            <tr>
              <td className="py-3 px-3 font-semibold text-dashboard-accent-blue">PLAN TRFS</td>
              {quarterlyData.map(q => (
                <td key={q.quarter} className="py-3 px-3 text-center font-display text-base text-dashboard-text">{q.plan}</td>
              ))}
              <td className="py-3 px-3 text-right font-display text-base font-bold text-dashboard-accent-blue">{totalPlan}</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold text-dashboard-accent-purple">ACTUAL TRFS</td>
              {quarterlyData.map(q => (
                <td key={q.quarter} className="py-3 px-3 text-center font-display text-base text-dashboard-text">{q.actual}</td>
              ))}
              <td className="py-3 px-3 text-right font-display text-base font-bold text-dashboard-accent-purple">{totalActual}</td>
            </tr>
            <tr className="bg-white/5 font-semibold">
              <td className="py-2.5 px-3 text-dashboard-muted text-xs">% ACHIEVED</td>
              {quarterlyData.map(q => (
                <td key={q.quarter} className="py-2.5 px-3 text-center text-xs text-dashboard-text">{q.pct}</td>
              ))}
              <td className="py-2.5 px-3 text-right text-xs text-dashboard-accent-green">{totalPct}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
