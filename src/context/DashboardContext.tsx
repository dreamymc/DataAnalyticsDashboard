"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { DashboardState, DashboardAction, FilterState, DashboardAssumptions } from '@/types';

const defaultAssumptions: DashboardAssumptions = {
  rtbCount: 271,
  rftiCount: 166,
  ytdActual: 99,
  ytdPlan: 158,
  q3SprintTarget: 33,
};

const defaultFilters: FilterState = {
  salesArea: '',
  province: '',
  town: '',
  accessVendor: '',
  tco: '',
  solutionType: '',
  vanguardPrioSite: '',
};

const initialState: DashboardState = {
  dataSource: null,
  rawData: [],
  filters: defaultFilters,
  assumptions: defaultAssumptions,
  isLoading: false,
  error: null,
  previewData: null,
  headers: null,
  googleSheetsUrl: null,
  lastRefreshed: null,
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_DATA':
      return {
        ...state,
        dataSource: action.payload.source,
        rawData: action.payload.data,
        previewData: null,
        headers: null,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_DATA':
      return {
        ...state,
        dataSource: null,
        rawData: [],
        previewData: null,
        headers: null,
        error: null,
        filters: defaultFilters,
      };
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: defaultFilters,
      };
    case 'UPDATE_ASSUMPTION':
      return {
        ...state,
        assumptions: {
          ...state.assumptions,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_PREVIEW':
      return {
        ...state,
        previewData: action.payload.data,
        headers: action.payload.headers,
        isLoading: false,
        error: null,
      };
    case 'CONFIRM_IMPORT':
      return {
        ...state,
        previewData: null,
        headers: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'CANCEL_PREVIEW':
      return {
        ...state,
        previewData: null,
        headers: null,
        isLoading: false,
      };
    case 'SET_GOOGLE_SHEETS_URL':
      return {
        ...state,
        googleSheetsUrl: action.payload,
      };
    case 'SET_LAST_REFRESHED':
      return {
        ...state,
        lastRefreshed: action.payload,
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

  // Load assumptions & metadata from localStorage on mount (never rawData)
  useEffect(() => {
    const savedState = localStorage.getItem('atglobe-dashboard-config-v2');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({
          type: 'LOAD_STATE',
          payload: {
            assumptions: parsed.assumptions || defaultAssumptions,
            googleSheetsUrl: parsed.googleSheetsUrl || null,
            lastRefreshed: parsed.lastRefreshed || null,
          },
        });
      } catch (e) {
        console.error('Failed to parse saved dashboard config', e);
      }
    }
  }, []);

  // Persist assumptions & metadata to localStorage on change
  useEffect(() => {
    localStorage.setItem(
      'atglobe-dashboard-config-v2',
      JSON.stringify({
        assumptions: state.assumptions,
        googleSheetsUrl: state.googleSheetsUrl,
        lastRefreshed: state.lastRefreshed,
      })
    );
  }, [state.assumptions, state.googleSheetsUrl, state.lastRefreshed]);

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
