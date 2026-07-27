"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { DashboardState, DashboardAction, SiteRecord, FilterState, DashboardAssumptions, PreviewRow } from '@/types';

const defaultAssumptions: DashboardAssumptions = {
  pipeline: 619,
  planTotal: 263,
  rtbCount: 271,
  rftiCount: 166,
  ytdActual: 99,
  ytdPlan: 158,
  monthGap: 59,
  quarterlyPlan: { q1: 77, q2: 56, q3: 74, q4: 56 },
  quarterlyActual: { q1: 43, q2: 50, q3: 6, q4: 0 },
  monthlyPlanTrfs: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120], // placeholders
  monthlyActualTrfs: [5, 15, 25, 35, 45, 55, 60, 0, 0, 0, 0, 0], // placeholders
  q3SprintLine: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  rfiRallyData: {
    forMob: 45,
    excavation: 30,
    rebarInstallation: 25,
    concretePouring: 20,
    backfilling: 15,
    towerErection: 10,
    sRfi: 5,
    rfi: 2
  },
  stageOrder: [
    "[01] IDENTIFICATION", "[02] ACQUISITION", "[03] PERMITTING", "[04] DESIGN",
    "[05] CW DOING", "[06] S-RFI", "[07] S-RFI w/ TRS", "[08] RFI", "[09] RFI with TRS"
  ]
};

const defaultFilters: FilterState = {
  salesArea: '',
  province: '',
  town: '',
  accessVendor: '',
  tco: '',
  solutionType: '',
  vanguardPrioSite: ''
};

const initialState: DashboardState = {
  dataSource: null,
  rawData: [],
  filters: defaultFilters,
  assumptions: defaultAssumptions,
  isLoading: false,
  error: null,
  previewData: null,
  headers: null
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'LOAD_STATE':
      return {
        ...state,
        ...(action.payload.assumptions ? { assumptions: action.payload.assumptions } : {}),
        ...(action.payload.rawData ? { rawData: action.payload.rawData } : {}),
        ...(action.payload.dataSource ? { dataSource: action.payload.dataSource } : {})
      };
    case 'SET_DATA':
      return {
        ...state,
        dataSource: action.payload.source,
        rawData: action.payload.data,
        previewData: null,
        headers: null,
        isLoading: false,
        error: null
      };
    case 'CLEAR_DATA':
      return {
        ...state,
        dataSource: null,
        rawData: [],
        previewData: null,
        headers: null,
        error: null,
        filters: defaultFilters
      };
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: defaultFilters
      };
    case 'UPDATE_ASSUMPTION':
      return {
        ...state,
        assumptions: {
          ...state.assumptions,
          [action.payload.key]: action.payload.value
        }
      };
    case 'SET_PREVIEW':
      return {
        ...state,
        previewData: action.payload.data,
        headers: action.payload.headers,
        isLoading: false,
        error: null
      };
    case 'CONFIRM_IMPORT':
      return {
        ...state,
        previewData: null,
        headers: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'CANCEL_PREVIEW':
      return {
        ...state,
        previewData: null,
        headers: null,
        isLoading: false
      };
    default:
      return state;
  }
}

const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
} | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('dashboardState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({
          type: 'LOAD_STATE',
          payload: {
            assumptions: parsed.assumptions,
            rawData: parsed.rawData,
            dataSource: parsed.dataSource
          }
        });
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('dashboardState', JSON.stringify({
      assumptions: state.assumptions,
      rawData: state.rawData,
      dataSource: state.dataSource
    }));
  }, [state.assumptions, state.rawData, state.dataSource]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
