"use client";

import React from 'react';
import { useComputedData } from '@/lib/data-computed';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function ProvincePlanActualChart() {
  const { provinceBreakdownData } = useComputedData();

  // Top 15 provinces for bar chart clarity
  const displayData = provinceBreakdownData.slice(0, 15);

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-5 h-96 flex flex-col mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-display font-bold text-dashboard-text tracking-wide uppercase">
          Province Breakdown (Pipeline vs Plan vs Actual TRFS)
        </h3>
        <span className="text-xs text-dashboard-muted">
          Showing top 15 of {provinceBreakdownData.length} provinces
        </span>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={displayData} 
            margin={{ top: 10, right: 30, left: 110, bottom: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
            <XAxis type="number" stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 11 }} />
            <YAxis 
              dataKey="province" 
              type="category" 
              stroke="#8b949e" 
              tick={{ fill: '#8b949e', fontSize: 10 }}
              width={140}
            />
            <Tooltip 
              cursor={{ fill: '#30363d', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#e2e8f0', borderRadius: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '5px', fontSize: '12px' }} />
            <Bar dataKey="pipeline" name="Pipeline" fill="#4a5568" radius={[0, 3, 3, 0]} />
            <Bar dataKey="plan" name="PLAN (In-Year)" fill="#3182ce" radius={[0, 3, 3, 0]} />
            <Bar dataKey="trfs" name="Actual TRFS" fill="#6b46c1" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
