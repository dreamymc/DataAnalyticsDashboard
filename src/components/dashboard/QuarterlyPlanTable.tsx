"use client";

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { EditableNumber } from '@/components/ui/EditableNumber';

export function QuarterlyPlanTable() {
  const { state, dispatch } = useDashboard();
  const { assumptions } = state;
  const { quarterlyPlan, quarterlyActual } = assumptions;

  const updateQuarterlyPlan = (q: keyof typeof quarterlyPlan, val: number) => {
    dispatch({
      type: 'UPDATE_ASSUMPTION',
      payload: {
        key: 'quarterlyPlan',
        value: { ...quarterlyPlan, [q]: val }
      }
    });
  };

  const updateQuarterlyActual = (q: keyof typeof quarterlyActual, val: number) => {
    dispatch({
      type: 'UPDATE_ASSUMPTION',
      payload: {
        key: 'quarterlyActual',
        value: { ...quarterlyActual, [q]: val }
      }
    });
  };

  const totalPlan = quarterlyPlan.q1 + quarterlyPlan.q2 + quarterlyPlan.q3 + quarterlyPlan.q4;
  const totalActual = quarterlyActual.q1 + quarterlyActual.q2 + quarterlyActual.q3 + quarterlyActual.q4;

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-dashboard-muted mb-4">Quarterly TRFS</h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-dashboard-border text-dashboard-muted">
            <th className="py-2"></th>
            <th className="py-2">Q1</th>
            <th className="py-2">Q2</th>
            <th className="py-2">Q3</th>
            <th className="py-2">Q4</th>
            <th className="py-2">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-dashboard-border/50">
            <td className="py-3 font-medium text-dashboard-accent-blue">PLAN</td>
            <td className="py-3"><EditableNumber value={quarterlyPlan.q1} onChange={(v) => updateQuarterlyPlan('q1', v)} /></td>
            <td className="py-3"><EditableNumber value={quarterlyPlan.q2} onChange={(v) => updateQuarterlyPlan('q2', v)} /></td>
            <td className="py-3"><EditableNumber value={quarterlyPlan.q3} onChange={(v) => updateQuarterlyPlan('q3', v)} /></td>
            <td className="py-3"><EditableNumber value={quarterlyPlan.q4} onChange={(v) => updateQuarterlyPlan('q4', v)} /></td>
            <td className="py-3 font-bold text-dashboard-text">{totalPlan}</td>
          </tr>
          <tr>
            <td className="py-3 font-medium text-dashboard-accent-purple">ACTUAL</td>
            <td className="py-3"><EditableNumber value={quarterlyActual.q1} onChange={(v) => updateQuarterlyActual('q1', v)} /></td>
            <td className="py-3"><EditableNumber value={quarterlyActual.q2} onChange={(v) => updateQuarterlyActual('q2', v)} /></td>
            <td className="py-3"><EditableNumber value={quarterlyActual.q3} onChange={(v) => updateQuarterlyActual('q3', v)} /></td>
            <td className="py-3"><EditableNumber value={quarterlyActual.q4} onChange={(v) => updateQuarterlyActual('q4', v)} /></td>
            <td className="py-3 font-bold text-dashboard-text">{totalActual}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
