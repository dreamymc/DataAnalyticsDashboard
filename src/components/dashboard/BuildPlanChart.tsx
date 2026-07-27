"use client";

import React from 'react';
import { useComputedData } from '@/lib/data-computed';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';

export function BuildPlanChart() {
  const { buildPlanData } = useComputedData();
  const sprintTarget = buildPlanData[0]?.sprint ?? 33;

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-5 h-96 flex flex-col mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-display font-bold text-dashboard-text tracking-wide uppercase">
          Build Plan vs Actual TRFS (In-Year)
        </h3>
        <span className="text-xs text-dashboard-muted">
          Orange line: Q3 Sprint Reference Target ({sprintTarget})
        </span>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={buildPlanData} margin={{ top: 20, right: 30, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis dataKey="month" stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 12 }} />
            <YAxis stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#e2e8f0', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '13px' }} />
            <Bar dataKey="plan" name="Plan TRFS" fill="#3182ce" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual TRFS" fill="#6b46c1" radius={[4, 4, 0, 0]} />
            <ReferenceLine 
              y={sprintTarget} 
              stroke="#dd6b20" 
              strokeWidth={2.5} 
              strokeDasharray="4 4"
              label={{ value: `Q3 Sprint Target (${sprintTarget})`, fill: '#dd6b20', position: 'top', fontSize: 11 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
