"use client";

import React from 'react';
import { useComputedData } from '@/lib/data-computed';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';

export function TCOCharts() {
  const { tcoAwardData, tcoPerformanceData } = useComputedData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96 mb-6">
      {/* TCO Award Chart */}
      <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-5 flex flex-col">
        <h3 className="text-base font-display font-bold text-dashboard-text tracking-wide uppercase mb-3">
          TCO / BAU Vendor Breakdown
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              layout="vertical" 
              data={tcoAwardData} 
              margin={{ top: 10, right: 35, left: 70, bottom: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
              <XAxis type="number" stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 11 }} />
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
                <LabelList dataKey="count" position="right" fill="#e2e8f0" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TCO Performance Chart */}
      <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-5 flex flex-col">
        <h3 className="text-base font-display font-bold text-dashboard-text tracking-wide uppercase mb-3">
          TRS Performance Status
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              layout="vertical" 
              data={tcoPerformanceData} 
              margin={{ top: 10, right: 35, left: 120, bottom: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
              <XAxis type="number" stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 11 }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#8b949e" 
                tick={{ fill: '#8b949e', fontSize: 10 }}
                width={160}
              />
              <Tooltip 
                cursor={{ fill: '#30363d', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#e2e8f0', borderRadius: '8px' }}
              />
              <Bar dataKey="count" name="Sites" fill="#3182ce" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="count" position="right" fill="#e2e8f0" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
