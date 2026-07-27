"use client";

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#6b46c1', '#3182ce', '#dd6b20', '#38a169', '#e53e3e'];

export function TCOCharts() {
  const awardData = [
    { name: 'Vendor A', value: 45 },
    { name: 'Vendor B', value: 30 },
    { name: 'Vendor C', value: 25 },
  ];

  const performanceData = [
    { name: 'On Track', value: 60 },
    { name: 'At Risk', value: 25 },
    { name: 'Delayed', value: 15 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
      <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-4 flex flex-col relative">
        <div className="absolute top-4 right-4 bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider z-10">
          RECONSTRUCTED - UNVERIFIED
        </div>
        <h3 className="text-lg font-display font-bold mb-4">TCO Award</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={awardData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {awardData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#e2e8f0', borderRadius: '8px' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-4 flex flex-col relative">
        <div className="absolute top-4 right-4 bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider z-10">
          RECONSTRUCTED - UNVERIFIED
        </div>
        <h3 className="text-lg font-display font-bold mb-4">TCO Performance</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#e2e8f0', borderRadius: '8px' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
