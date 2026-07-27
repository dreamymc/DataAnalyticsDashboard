"use client";

import React from 'react';
import { useComputedData } from '@/lib/data-computed';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';

export function StageFunnelChart() {
  const { stageCounts } = useComputedData();

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-4 h-96 flex flex-col">
      <h3 className="text-lg font-display font-bold mb-4">Lead Indicator / Stage Funnel</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={stageCounts} 
            margin={{ top: 20, right: 30, left: 60, bottom: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
            <XAxis type="number" stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 12 }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#8b949e" 
              tick={{ fill: '#8b949e', fontSize: 11 }}
              width={100}
            />
            <Tooltip 
              cursor={{ fill: '#30363d', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#e2e8f0', borderRadius: '8px' }}
            />
            <Bar dataKey="count" name="Sites" fill="#6b46c1" radius={[0, 4, 4, 0]}>
              <LabelList dataKey="count" position="right" fill="#e2e8f0" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
