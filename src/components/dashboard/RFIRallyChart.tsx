"use client";

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';

export function RFIRallyChart() {
  const { state } = useDashboard();
  const { rfiRallyData } = state.assumptions;

  const data = [
    { name: 'For Mob', value: rfiRallyData.forMob },
    { name: 'Excavation', value: rfiRallyData.excavation },
    { name: 'Rebar Installation', value: rfiRallyData.rebarInstallation },
    { name: 'Concrete Pouring', value: rfiRallyData.concretePouring },
    { name: 'Backfilling', value: rfiRallyData.backfilling },
    { name: 'Tower Erection', value: rfiRallyData.towerErection },
    { name: 'S-RFI', value: rfiRallyData.sRfi },
    { name: 'RFI', value: rfiRallyData.rfi },
  ];

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-4 h-96 flex flex-col relative">
      <div className="absolute top-4 right-4 bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider z-10">
        MOCK DATA
      </div>
      <h3 className="text-lg font-display font-bold mb-4">RFI Rally</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={data} 
            margin={{ top: 20, right: 30, left: 60, bottom: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
            <XAxis type="number" stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 12 }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#8b949e" 
              tick={{ fill: '#8b949e', fontSize: 11 }}
              width={110}
            />
            <Tooltip 
              cursor={{ fill: '#30363d', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#e2e8f0', borderRadius: '8px' }}
            />
            <Bar dataKey="value" name="Sites" fill="#3182ce" radius={[0, 4, 4, 0]}>
               <LabelList dataKey="value" position="right" fill="#e2e8f0" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
