"use client";

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { useComputedData } from '@/lib/data-computed';
import { ScorecardTile } from '@/components/ui/ScorecardTile';
import { EditableNumber } from '@/components/ui/EditableNumber';

export function ScorecardRow() {
  const { state, dispatch } = useDashboard();
  const { assumptions } = state;
  const { scorecards, ytdData } = useComputedData();

  const updateAssumption = (key: string, value: number) => {
    dispatch({ type: 'UPDATE_ASSUMPTION', payload: { key: key as any, value } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <ScorecardTile 
        title="PIPELINE" 
        value={
          <EditableNumber 
            value={assumptions.pipeline} 
            onChange={(v) => updateAssumption('pipeline', v)} 
          />
        } 
      />
      <ScorecardTile 
        title="PLAN" 
        value={
          <EditableNumber 
            value={assumptions.planTotal} 
            onChange={(v) => updateAssumption('planTotal', v)} 
          />
        } 
      />
      <ScorecardTile 
        title="ACTUAL" 
        value={scorecards.actual} 
        gradient 
      />
      <ScorecardTile 
        title="% TRFS" 
        value={`${scorecards.percentTrfs}%`} 
        gradient 
      />
      <ScorecardTile 
        title="YTD % TRFS" 
        value={`${ytdData.percentTrfs}%`} 
        subtitle={`Actual: ${ytdData.actual} / Plan: ${ytdData.plan}`}
      />
      <ScorecardTile 
        title="RTB / % RTB" 
        value={
          <div className="flex items-center gap-2 text-2xl font-display">
            <EditableNumber value={assumptions.rtbCount} onChange={(v) => updateAssumption('rtbCount', v)} />
            <span className="text-lg text-dashboard-muted">/ {scorecards.percentRtb}%</span>
          </div>
        } 
      />
      <ScorecardTile 
        title="RFTI / % RFTI" 
        value={
          <div className="flex items-center gap-2 text-2xl font-display">
            <EditableNumber value={assumptions.rftiCount} onChange={(v) => updateAssumption('rftiCount', v)} />
            <span className="text-lg text-dashboard-muted">/ {scorecards.percentRfti}%</span>
          </div>
        } 
      />
    </div>
  );
}
