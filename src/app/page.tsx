"use client";

import { useDashboard } from "@/context/DashboardContext";
import { ExcelUploader } from "@/components/data/ExcelUploader";
import { GoogleSheetInput } from "@/components/data/GoogleSheetInput";

import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { ScorecardRow } from "@/components/dashboard/ScorecardRow";
import { QuarterlyPlanTable } from "@/components/dashboard/QuarterlyPlanTable";
import { AssumptionsPanel } from "@/components/ui/AssumptionsPanel";
import { BuildPlanChart } from "@/components/dashboard/BuildPlanChart";
import { StageFunnelChart } from "@/components/dashboard/StageFunnelChart";
import { RFIRallyChart } from "@/components/dashboard/RFIRallyChart";
import { TCOCharts } from "@/components/dashboard/TCOCharts";

export default function Home() {
  const { state, dispatch } = useDashboard();

  return (
    <div className="flex h-screen w-full bg-dashboard-bg text-dashboard-text overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-dashboard-border bg-dashboard-card p-4 flex flex-col shrink-0">
        <h1 className="text-2xl font-display font-bold mb-6">T8 DASHBOARD</h1>
        
        <div className="flex-1 overflow-hidden">
          <FilterPanel />
        </div>
        
        {state.rawData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dashboard-border shrink-0">
             <div className="text-xs text-dashboard-muted mb-2">Data Source</div>
             <button 
               onClick={() => {
                 dispatch({ type: 'CLEAR_DATA' });
               }}
               className="text-sm text-dashboard-accent-blue hover:underline mb-4 block"
             >
               Load different data
             </button>
             <AssumptionsPanel />
          </div>
        )}
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-6 custom-scrollbar">
        {state.rawData.length === 0 ? (
          <div className="max-w-2xl mx-auto w-full mt-10">
            <h2 className="text-2xl font-display font-bold mb-6 text-center">Load Data to Start</h2>
            <ExcelUploader />
            <GoogleSheetInput />
          </div>
        ) : (
          <div className="max-w-[1600px]">
            <ScorecardRow />
            
            <div className="mb-6">
               <BuildPlanChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
               <StageFunnelChart />
               <RFIRallyChart />
            </div>

            <div className="mb-6">
               <TCOCharts />
            </div>

            <div className="mb-6 max-w-3xl">
               <QuarterlyPlanTable />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
