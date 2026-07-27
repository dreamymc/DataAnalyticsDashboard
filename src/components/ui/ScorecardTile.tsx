import React from 'react';

interface Props {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  gradient?: boolean;
}

export function ScorecardTile({ title, value, subtitle, gradient }: Props) {
  return (
    <div className={`p-4 rounded-lg flex flex-col justify-center items-center min-h-[120px] ${gradient ? 'scorecard-gradient text-white' : 'bg-dashboard-card border border-dashboard-border text-dashboard-text'}`}>
      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${gradient ? 'text-white/80' : 'text-dashboard-muted'}`}>
        {title}
      </h3>
      <div className="text-4xl font-display font-bold">
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
