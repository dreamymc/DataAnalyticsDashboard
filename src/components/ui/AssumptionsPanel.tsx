"use client";

import React, { useState } from 'react';

export function AssumptionsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-xs font-medium border border-dashboard-border rounded hover:bg-white/5 transition-colors text-dashboard-muted hover:text-dashboard-text"
      >
        Edit Assumptions
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-dashboard-bg border border-dashboard-border rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">Dashboard Assumptions</h2>
              <button onClick={() => setIsOpen(false)} className="text-dashboard-muted hover:text-white text-xl">✕</button>
            </div>
            
            <p className="text-sm text-dashboard-muted mb-6">
              Many values are currently edited inline by clicking directly on the numbers on the dashboard. 
              Advanced assumptions (like chart mock data) will be added here in the future.
            </p>
            
            <div className="flex justify-end mt-8">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-dashboard-accent-blue text-white rounded font-medium hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
