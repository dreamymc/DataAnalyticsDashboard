"use client";

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function BuildPlanChart() {
  const { state } = useDashboard();
  const { assumptions } = state;

  const data = MONTHS.map((month, idx) => ({
    name: month,
    plan: assumptions.monthlyPlanTrfs[idx] || 0,
    actual: assumptions.monthlyActualTrfs[idx] || 0,
    sprint: assumptions.q3SprintLine[idx] || 0,
  }));

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-4 h-96 flex flex-col">
      <h3 className="text-lg font-display font-bold mb-4">Build Plan vs Actual TRFS</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis dataKey="name" stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 12 }} />
            <YAxis stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#e2e8f0', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="plan" name="Plan TRFS" fill="#3182ce" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual TRFS" fill="#6b46c1" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="sprint" name="Q3 Sprint" stroke="#dd6b20" strokeWidth={3} dot={{ r: 4, fill: '#dd6b20' }}>
               <LabelList dataKey="sprint" position="top" fill="#e2e8f0" fontSize={11} offset={10} />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
