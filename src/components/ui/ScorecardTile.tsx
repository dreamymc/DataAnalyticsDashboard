import React from 'react';

interface Props {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  gradient?: boolean;
}

export function ScorecardTile({ title, value, subtitle, gradient }: Props) {
  return (
    <div className={`p-4 rounded-lg flex flex-col justify-center items-center min-h-[120px] shadow-lg ${gradient ? 'scorecard-gradient text-white border border-purple-500/30' : 'bg-dashboard-card border border-dashboard-border text-dashboard-text'}`}>
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${gradient ? 'text-white/80' : 'text-dashboard-muted'}`}>
        {title}
      </h3>
      <div className="text-3xl font-display font-bold">
        {value}
      </div>
      {subtitle && (
        <div className={`text-xs mt-2 ${gradient ? 'text-white/70' : 'text-dashboard-muted'}`}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
