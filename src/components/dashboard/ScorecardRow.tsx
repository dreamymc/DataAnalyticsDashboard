"use client";

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { useComputedData } from '@/lib/data-computed';
import { ScorecardTile } from '@/components/ui/ScorecardTile';
import { EditableNumber } from '@/components/ui/EditableNumber';

export function ScorecardRow() {
  const { state, dispatch } = useDashboard();
  const { assumptions } = state;
  const { scorecards } = useComputedData();

  const updateAssumption = (key: string, value: number) => {
    dispatch({ type: 'UPDATE_ASSUMPTION', payload: { key: key as any, value } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <ScorecardTile 
        title="PIPELINE" 
        value={scorecards.pipeline} 
        subtitle="Total dataset rows"
      />
      <ScorecardTile 
        title="PLAN" 
        value={scorecards.plan} 
        subtitle="263 List = Yes"
      />
      <ScorecardTile 
        title="ACTUAL TRFS" 
        value={scorecards.actual} 
        gradient 
      />
      <ScorecardTile 
        title="% TRFS" 
        value={scorecards.percentTrfs} 
        gradient 
      />
      <ScorecardTile 
        title="RTB / % RTB" 
        value={
          <div className="flex items-center gap-1 font-display font-bold text-2xl text-dashboard-text">
            <EditableNumber value={assumptions.rtbCount} onChange={(v) => updateAssumption('rtbCount', v)} />
            <span className="text-sm font-normal text-dashboard-muted">({scorecards.percentRtb})</span>
          </div>
        } 
      />
      <ScorecardTile 
        title="RFTI / % RFTI" 
        value={
          <div className="flex items-center gap-1 font-display font-bold text-2xl text-dashboard-text">
            <EditableNumber value={assumptions.rftiCount} onChange={(v) => updateAssumption('rftiCount', v)} />
            <span className="text-sm font-normal text-dashboard-muted">({scorecards.percentRfti})</span>
          </div>
        } 
      />
      <ScorecardTile 
        title="YTD % TRFS" 
        value={scorecards.ytdPercentTrfs}
        subtitle={
          <div className="flex items-center gap-1 text-xs text-dashboard-muted">
            Act:<EditableNumber value={assumptions.ytdActual} onChange={(v) => updateAssumption('ytdActual', v)} />
            /
            Plan:<EditableNumber value={assumptions.ytdPlan} onChange={(v) => updateAssumption('ytdPlan', v)} />
          </div>
        }
      />
    </div>
  );
}
