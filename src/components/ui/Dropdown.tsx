import React from 'react';

interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function Dropdown({ label, value, options, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-xs font-semibold text-dashboard-muted uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`bg-dashboard-bg border border-dashboard-border rounded px-3 py-2 text-dashboard-text focus:outline-none focus:border-dashboard-accent-blue transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-dashboard-muted'}
        `}
      >
        <option value="">All</option>
        {options.map((opt, i) => (
          <option key={`${opt}-${i}`} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
