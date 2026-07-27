"use client";

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { fetchGoogleSheetCsv } from '@/lib/google-sheets';

const REFRESH_INTERVAL_SECONDS = 300; // 5 minutes

export function GoogleSheetInput() {
  const { state, dispatch } = useDashboard();
  const [urlInput, setUrlInput] = useState(state.googleSheetsUrl || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_SECONDS);

  const activeUrl = state.googleSheetsUrl;

  const loadData = async (targetUrl: string) => {
    if (!targetUrl) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchGoogleSheetCsv(targetUrl);
      if (data.length === 0) {
        throw new Error("No data found in the CSV or headers could not be mapped.");
      }

      dispatch({
        type: 'SET_DATA',
        payload: { source: 'google-sheets', data }
      });
      dispatch({
        type: 'SET_GOOGLE_SHEETS_URL',
        payload: targetUrl
      });
      const nowIso = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      dispatch({
        type: 'SET_LAST_REFRESHED',
        payload: nowIso
      });
      setCountdown(REFRESH_INTERVAL_SECONDS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to load Google Sheet CSV.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      loadData(urlInput);
    }
  };

  // Live countdown & 5-minute auto-refresh timer
  useEffect(() => {
    if (!activeUrl) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          loadData(activeUrl);
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeUrl]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-6 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-display font-bold text-dashboard-text">Or use Google Sheets (Published CSV)</h2>
        {state.lastRefreshed && (
          <div className="flex items-center gap-3 text-xs text-dashboard-muted">
            <span>Last Refreshed: <strong className="text-dashboard-text">{state.lastRefreshed}</strong></span>
            <span className="bg-dashboard-bg border border-dashboard-border px-2 py-0.5 rounded font-mono text-dashboard-accent-blue">
              Auto-refresh in {formatCountdown(countdown)}
            </span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-4 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input 
          type="url"
          placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
          className="flex-1 bg-dashboard-bg border border-dashboard-border rounded px-4 py-2 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-accent-blue"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading || !urlInput}
          className={`px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
            loading || !urlInput 
              ? 'bg-dashboard-border text-dashboard-muted cursor-not-allowed' 
              : 'bg-dashboard-accent-blue text-white hover:bg-blue-600 shadow-lg shadow-dashboard-accent-blue/20'
          }`}
        >
          {loading ? 'Fetching...' : activeUrl === urlInput ? 'Refresh Now' : 'Load CSV'}
        </button>
      </form>

      {state.dataSource === 'google-sheets' && state.rawData.length > 0 && (
        <div className="text-xs text-dashboard-accent-green mt-3 flex items-center gap-2 font-medium">
          ✓ Active Google Sheets Sync: {state.rawData.length} records loaded
        </div>
      )}
    </div>
  );
}
