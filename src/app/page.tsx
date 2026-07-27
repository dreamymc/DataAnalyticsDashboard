"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { ExcelUploader } from "@/components/data/ExcelUploader";
import { GoogleSheetInput } from "@/components/data/GoogleSheetInput";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { ScorecardRow } from "@/components/dashboard/ScorecardRow";
import { BuildPlanChart } from "@/components/dashboard/BuildPlanChart";
import { StageFunnelChart } from "@/components/dashboard/StageFunnelChart";
import { RFIRallyChart } from "@/components/dashboard/RFIRallyChart";
import { TCOCharts } from "@/components/dashboard/TCOCharts";
import { QuarterlyPlanTable } from "@/components/dashboard/QuarterlyPlanTable";
import { ProvincePlanActualChart } from "@/components/dashboard/ProvincePlanActualChart";
import { TownPlanActualTable } from "@/components/dashboard/TownPlanActualTable";
import { OngoingWirelessTable } from "@/components/dashboard/OngoingWirelessTable";
import { OngoingTransportTable } from "@/components/dashboard/OngoingTransportTable";
import { MasterSiteDetailsTable } from "@/components/dashboard/MasterSiteDetailsTable";
import { DataPreviewTable } from "@/components/dashboard/DataPreviewTable";
import { AssumptionsPanel } from "@/components/ui/AssumptionsPanel";

export default function Home() {
  const { state, dispatch } = useDashboard();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }));
  }, []);

  return (
    <div className="flex h-screen w-full bg-dashboard-bg text-dashboard-text overflow-hidden">
      {/* Sidebar Filters */}
      <aside className="w-72 border-r border-dashboard-border bg-dashboard-card flex flex-col shrink-0">
        <div className="p-5 border-b border-dashboard-border">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-display font-bold tracking-wider text-dashboard-text uppercase">
              T8 Dashboard
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-dashboard-accent-purple/20 text-purple-300 border border-purple-500/30">
              v2.0
            </span>
          </div>
          <p className="text-xs text-dashboard-muted mt-1">New Site Build Analytics</p>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <FilterPanel />
        </div>

        {state.rawData.length > 0 && (
          <div className="p-4 border-t border-dashboard-border bg-dashboard-bg/40 space-y-3">
            <button 
              onClick={() => dispatch({ type: 'CLEAR_DATA' })}
              className="w-full py-1.5 text-xs font-semibold uppercase tracking-wider text-dashboard-accent-blue border border-dashboard-border hover:bg-dashboard-card rounded transition-colors"
            >
              🔄 Change / Reload Data
            </button>
            <div className="w-full">
              <AssumptionsPanel />
            </div>
          </div>
        )}
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-6 custom-scrollbar">
        {/* Header Bar */}
        <header className="flex items-center justify-between pb-6 mb-6 border-b border-dashboard-border shrink-0">
          <div>
            <h2 className="text-2xl font-display font-bold text-dashboard-text tracking-wide uppercase">
              T8 New Site Build Performance
            </h2>
            <p className="text-xs text-dashboard-muted">
              Real-time site status tracking, construction stages, and supplier allocation.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {state.rawData.length > 0 && (
              <div className="text-right">
                <div className="text-xs font-mono text-dashboard-accent-green font-semibold">
                  ● ACTIVE ({state.rawData.length} Records)
                </div>
                <div className="text-xs text-dashboard-muted">Source: {state.dataSource?.toUpperCase()}</div>
              </div>
            )}
            <div className="bg-dashboard-card border border-dashboard-border px-3 py-1.5 rounded text-xs text-dashboard-muted font-mono" suppressHydrationWarning>
              📅 {mounted ? currentDate : '2026'}
            </div>
          </div>
        </header>

        {/* Main Content Sections */}
        {state.rawData.length === 0 ? (
          <div className="max-w-2xl mx-auto w-full my-auto py-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display font-bold text-dashboard-text mb-2">
                T8 New Site Build Analytics
              </h3>
              <p className="text-sm text-dashboard-muted">
                Upload your master Excel file or paste a published Google Sheets CSV URL to generate the dashboard.
              </p>
            </div>
            
            <ExcelUploader />
            <GoogleSheetInput />
          </div>
        ) : (
          <div className="space-y-6 pb-12">
            {/* Top Scorecard KPIs */}
            <ScorecardRow />
            
            {/* Main Build Plan Chart */}
            <BuildPlanChart />

            {/* Stage Funnel & RFI Rally Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StageFunnelChart />
              <RFIRallyChart />
            </div>

            {/* TCO Vendor & Performance Grid */}
            <TCOCharts />

            {/* Province Plan vs Actual Chart */}
            <ProvincePlanActualChart />

            {/* Town Plan vs Actual Table & Quarterly Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TownPlanActualTable />
              </div>
              <div>
                <QuarterlyPlanTable />
              </div>
            </div>

            {/* Ongoing Wireless Integration Table */}
            <OngoingWirelessTable />

            {/* Ongoing Transport RFTI Table */}
            <OngoingTransportTable />

            {/* Master Site Details Table */}
            <MasterSiteDetailsTable />

            {/* Full Data Preview & CSV Export */}
            <DataPreviewTable />
          </div>
        )}
      </main>
    </div>
  );
}
