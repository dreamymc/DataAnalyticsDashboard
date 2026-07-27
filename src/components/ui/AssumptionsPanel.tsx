"use client";

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';

export function AssumptionsPanel() {
  const { state, dispatch } = useDashboard();
  const { assumptions } = state;
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: string, value: number) => {
    dispatch({
      type: 'UPDATE_ASSUMPTION',
      payload: { key: key as any, value }
    });
  };

  const handleResetDefaults = () => {
    dispatch({
      type: 'UPDATE_ASSUMPTION',
      payload: { key: 'rtbCount', value: 271 }
    });
    dispatch({
      type: 'UPDATE_ASSUMPTION',
      payload: { key: 'rftiCount', value: 166 }
    });
    dispatch({
      type: 'UPDATE_ASSUMPTION',
      payload: { key: 'ytdActual', value: 99 }
    });
    dispatch({
      type: 'UPDATE_ASSUMPTION',
      payload: { key: 'ytdPlan', value: 158 }
    });
    dispatch({
      type: 'UPDATE_ASSUMPTION',
      payload: { key: 'q3SprintTarget', value: 33 }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border border-dashboard-border rounded bg-dashboard-card text-dashboard-text hover:bg-dashboard-border hover:text-white transition-colors shadow-sm"
      >
        ⚙ Assumptions & Overrides
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dashboard-card border border-dashboard-border rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-dashboard-border">
              <div>
                <h2 className="text-xl font-display font-bold text-dashboard-text">Dashboard Assumptions & Overrides</h2>
                <p className="text-xs text-dashboard-muted">Configure manual target assumptions and chart reference lines.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-dashboard-muted hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Section 1: Scorecard Overrides */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-dashboard-accent-blue mb-3">
                  Scorecard Assumptions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-dashboard-muted mb-1">RTB Count Target</label>
                    <input 
                      type="number"
                      value={assumptions.rtbCount}
                      onChange={(e) => handleChange('rtbCount', Number(e.target.value))}
                      className="bg-dashboard-bg border border-dashboard-border rounded px-3 py-2 text-sm text-dashboard-text w-full focus:outline-none focus:border-dashboard-accent-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dashboard-muted mb-1">RFTI Count Target</label>
                    <input 
                      type="number"
                      value={assumptions.rftiCount}
                      onChange={(e) => handleChange('rftiCount', Number(e.target.value))}
                      className="bg-dashboard-bg border border-dashboard-border rounded px-3 py-2 text-sm text-dashboard-text w-full focus:outline-none focus:border-dashboard-accent-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dashboard-muted mb-1">YTD Actual TRFS</label>
                    <input 
                      type="number"
                      value={assumptions.ytdActual}
                      onChange={(e) => handleChange('ytdActual', Number(e.target.value))}
                      className="bg-dashboard-bg border border-dashboard-border rounded px-3 py-2 text-sm text-dashboard-text w-full focus:outline-none focus:border-dashboard-accent-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dashboard-muted mb-1">YTD Plan TRFS</label>
                    <input 
                      type="number"
                      value={assumptions.ytdPlan}
                      onChange={(e) => handleChange('ytdPlan', Number(e.target.value))}
                      className="bg-dashboard-bg border border-dashboard-border rounded px-3 py-2 text-sm text-dashboard-text w-full focus:outline-none focus:border-dashboard-accent-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Chart Reference Line */}
              <div className="pt-4 border-t border-dashboard-border">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-dashboard-accent-orange mb-3">
                  Build Plan Chart Reference Line
                </h3>
                <div>
                  <label className="block text-xs text-dashboard-muted mb-1">Q3 Sprint Target Line (y-axis reference)</label>
                  <input 
                    type="number"
                    value={assumptions.q3SprintTarget}
                    onChange={(e) => handleChange('q3SprintTarget', Number(e.target.value))}
                    className="bg-dashboard-bg border border-dashboard-border rounded px-3 py-2 text-sm text-dashboard-text w-full focus:outline-none focus:border-dashboard-accent-orange"
                  />
                  <p className="text-[11px] text-dashboard-muted mt-1">
                    The Q3 Sprint Target column in Excel contains site-level integers (23, 24, 25, 27, 33). Default target line is set to 33.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-dashboard-border">
              <button 
                onClick={handleResetDefaults}
                className="text-xs text-dashboard-muted hover:text-white underline"
              >
                Reset to Defaults
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-dashboard-accent-blue text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-dashboard-accent-blue/20"
              >
                Done & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
